# Salarium Job Flow Auto-Cascade Implementation Guide

This technical document outlines the implementation details for the auto-cascade population system in the Salarium Job Flow interface. This feature dramatically simplifies the job description creation process by allowing users to generate an entire document from just a job title.

## 1. Auto-Cascade System Architecture

### Core Components

```
AutoCascadeSystem/
├── index.tsx                      # Main controller component
├── components/
│   ├── AutoGenerateButton.tsx     # Primary trigger button
│   ├── CascadeProgress.tsx        # Visual progress indicator
│   ├── RegenerationOptions.tsx    # Options for section regeneration
│   └── CascadeController.tsx      # Manages the generation sequence
└── hooks/
    ├── useCascadeGeneration.tsx   # Main hook for cascade process
    ├── useRegenerationOptions.tsx # Controls regeneration behavior
    └── useSectionGeneration.tsx   # Individual section generation
```

### State Management

```typescript
interface CascadeState {
  isGenerating: boolean;           // Whether cascade generation is active
  currentSectionIndex: number;     // Index of section being generated
  completedSections: string[];     // IDs of completed sections
  queuedSections: string[];        // IDs of sections waiting to be generated
  generationProgress: number;      // Overall progress (0-100)
  error: string | null;            // Error message if generation fails
}

interface CascadeOptions {
  startFromSection: number;        // Which section to start generation from
  regenerateCompleted: boolean;    // Whether to regenerate completed sections
  preserveSections: string[];      // Section IDs to preserve (not regenerate)
  stylePreference: 'detailed' | 'concise' | 'technical'; // Output style
  generateAll: boolean;            // Whether to generate all sections at once
}
```

### Main Cascade Hook

```typescript
// Main hook for handling the cascade generation process
const useCascadeGeneration = (documentId: string, options: CascadeOptions) => {
  const [state, setState] = useState<CascadeState>({
    isGenerating: false,
    currentSectionIndex: options.startFromSection,
    completedSections: [],
    queuedSections: [],
    generationProgress: 0,
    error: null,
  });
  
  const { processSection } = useAiAssistant(documentId);
  const { sections } = useDocumentState(documentId);
  
  const startCascadeGeneration = async () => {
    try {
      setState(prev => ({ 
        ...prev, 
        isGenerating: true,
        queuedSections: sections
          .filter((s, idx) => idx >= options.startFromSection)
          .filter(s => !options.preserveSections.includes(s.id))
          .map(s => s.id)
      }));
      
      // Process first section or all sections based on options
      if (options.generateAll) {
        await generateAllSections();
      } else {
        await generateNextSection();
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'Generation failed',
        isGenerating: false 
      }));
    }
  };
  
  const generateNextSection = async () => {
    if (state.queuedSections.length === 0) {
      setState(prev => ({ ...prev, isGenerating: false }));
      return;
    }
    
    const nextSectionId = state.queuedSections[0];
    const sectionIndex = sections.findIndex(s => s.id === nextSectionId);
    
    // Get context from previous sections
    const context = sections
      .filter((s, idx) => idx < sectionIndex && s.content)
      .map(s => ({ 
        id: s.id, 
        title: s.title, 
        content: serializeSlateToText(s.content) 
      }));
    
    setState(prev => ({ 
      ...prev, 
      currentSectionIndex: sectionIndex,
      queuedSections: prev.queuedSections.slice(1),
    }));
    
    try {
      // Process this section
      const result = await processSection(nextSectionId, null, context);
      
      // Update section content
      await updateSectionContent(nextSectionId, result);
      
      // Add to completed sections
      setState(prev => ({ 
        ...prev, 
        completedSections: [...prev.completedSections, nextSectionId],
        generationProgress: calculateProgress(sections.length, prev.completedSections.length + 1)
      }));
      
      // Process next section
      await generateNextSection();
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: `Error generating section ${sectionIndex + 1}: ${error.message}`, 
        isGenerating: false 
      }));
    }
  };
  
  const generateAllSections = async () => {
    // Implementation for generating all sections in parallel (for advanced use)
    // This would involve multiple API calls and managing concurrent responses
  };
  
  const cancelGeneration = () => {
    setState(prev => ({ 
      ...prev, 
      isGenerating: false,
      queuedSections: [] 
    }));
  };
  
  return {
    ...state,
    startCascadeGeneration,
    cancelGeneration,
  };
};
```

### Auto-Generate Button Component

```tsx
// Primary button component to trigger cascade generation
const AutoGenerateButton: React.FC = () => {
  const { documentId } = useParams();
  const { sections } = useDocumentState(documentId);
  const { startCascadeGeneration, isGenerating, generationProgress } = useCascadeGeneration(
    documentId,
    { 
      startFromSection: 0, 
      regenerateCompleted: true,
      preserveSections: [],
      stylePreference: 'detailed',
      generateAll: true 
    }
  );
  
  return (
    <div className="flex flex-col space-y-2">
      <Button
        size="lg"
        className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium"
        onClick={startCascadeGeneration}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Generating... {Math.round(generationProgress)}%</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Wand2 className="h-4 w-4" />
            <span>Auto-Generate All</span>
          </div>
        )}
      </Button>
      
      {isGenerating && (
        <Button
          variant="outline"
          size="sm"
          onClick={cancelGeneration}
          className="text-xs"
        >
          Cancel Generation
        </Button>
      )}
    </div>
  );
};
```

## 2. Rich Text Editing Implementation

### Editor Component Structure

```
RichTextEditor/
├── index.tsx                      # Main editor component
├── components/
│   ├── Toolbar.tsx                # Formatting toolbar
│   ├── ContentEditable.tsx        # Editable content area
│   ├── FloatingToolbar.tsx        # Context-sensitive toolbar
│   ├── MediaInsert/               # Media insertion components
│   │   ├── ImageInsert.tsx        # Image insertion
│   │   ├── TableInsert.tsx        # Table insertion
│   │   ├── IconInsert.tsx         # Icon insertion
│   │   └── ShapeInsert.tsx        # Shape insertion
│   └── FormatPanel.tsx            # Sidebar formatting panel
└── plugins/                       # Editor plugins
    ├── withTables.ts              # Table support
    ├── withImages.ts              # Image support
    ├── withFormatting.ts          # Text formatting
    ├── withLists.ts               # List formatting
    └── withAutoSave.ts            # Auto-save functionality
```

### Slate.js Editor Configuration

```typescript
// Configure Slate.js for rich text editing
const withRichText = (editor: Editor) => {
  const e = withHistory(withReact(editor));
  
  // Add custom plugins
  const withPlugins = [
    withTables,
    withImages,
    withFormatting,
    withLists,
    withAutoSave,
  ].reduce((editor, plugin) => plugin(editor), e);
  
  return withPlugins;
};

// Rich text editor component
const RichTextEditor: React.FC<{
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
  placeholder?: string;
  readOnly?: boolean;
}> = ({ value, onChange, placeholder, readOnly = false }) => {
  const editor = useMemo(() => withRichText(createEditor()), []);
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  
  return (
    <div className="relative border rounded-md overflow-hidden">
      {!readOnly && <Toolbar editor={editor} />}
      
      <Slate editor={editor} value={value} onChange={onChange}>
        <div className="p-4">
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder={placeholder}
            readOnly={readOnly}
            spellCheck
            className="prose max-w-none focus:outline-none min-h-[200px]"
          />
        </div>
        
        {!readOnly && <FloatingToolbar editor={editor} />}
      </Slate>
    </div>
  );
};
```

### Document Formatting Components

```tsx
// Format panel component for the sidebar
const FormatPanel: React.FC<{
  editor: Editor;
}> = ({ editor }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Text</h3>
        <div className="flex space-x-1">
          <Button
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => toggleMark(editor, 'bold')}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => toggleMark(editor, 'italic')}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => toggleMark(editor, 'underline')}
          >
            <Underline className="h-4 w-4" />
          </Button>
          <Select
            value="default"
            onValueChange={(value) => setTextColor(editor, value)}
          >
            <SelectTrigger className="h-8 w-24">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-black" />
                <span className="text-xs">Color</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="#000000">Black</SelectItem>
              <SelectItem value="#2563eb">Blue</SelectItem>
              <SelectItem value="#16a34a">Green</SelectItem>
              <SelectItem value="#dc2626">Red</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Paragraph</h3>
        <div className="flex space-x-1">
          <Button
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => toggleBlock(editor, 'left')}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => toggleBlock(editor, 'center')}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => toggleBlock(editor, 'right')}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Select
            value="1.5"
            onValueChange={(value) => setLineSpacing(editor, value)}
          >
            <SelectTrigger className="h-8 w-20">
              <span className="text-xs">Spacing</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1.0</SelectItem>
              <SelectItem value="1.15">1.15</SelectItem>
              <SelectItem value="1.5">1.5</SelectItem>
              <SelectItem value="2">2.0</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Insert</h3>
        <div className="flex space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => insertTable(editor)}
          >
            <Table className="h-4 w-4 mr-1" />
            <span className="text-xs">Table</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => insertImage(editor)}
          >
            <Image className="h-4 w-4 mr-1" />
            <span className="text-xs">Image</span>
          </Button>
        </div>
        <div className="flex space-x-1 mt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => insertIcon(editor)}
          >
            <Smile className="h-4 w-4 mr-1" />
            <span className="text-xs">Icon</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => insertShape(editor)}
          >
            <Square className="h-4 w-4 mr-1" />
            <span className="text-xs">Shape</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
```

## 3. Regeneration Options Implementation

### Section Regeneration Controls

```tsx
// Options for regenerating sections
const RegenerationOptions: React.FC<{
  sectionId: string;
  documentId: string;
  onClose: () => void;
}> = ({ sectionId, documentId, onClose }) => {
  const [regenerationType, setRegenerationType] = useState<'section' | 'cascade'>('section');
  const [stylePreference, setStylePreference] = useState<'detailed' | 'concise' | 'technical'>('detailed');
  
  const { sections } = useDocumentState(documentId);
  const { startCascadeGeneration } = useCascadeGeneration(documentId, {
    startFromSection: sections.findIndex(s => s.id === sectionId),
    regenerateCompleted: true,
    preserveSections: regenerationType === 'section' ? 
      sections.filter(s => s.id !== sectionId).map(s => s.id) : 
      sections.filter((s, idx) => idx < sections.findIndex(s => s.id === sectionId)).map(s => s.id),
    stylePreference,
    generateAll: false
  });
  
  return (
    <Card className="w-80">
      <CardHeader className="py-3">
        <CardTitle className="text-sm">AI OPTIONS</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-6 w-6 p-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="py-2 space-y-4">
        <div className="space-y-2">
          <RadioGroup
            value={regenerationType}
            onValueChange={(value) => setRegenerationType(value as 'section' | 'cascade')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="section" id="section" />
              <Label htmlFor="section">Regenerate This Section Only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cascade" id="cascade" />
              <Label htmlFor="cascade">
                Regenerate From Here (all following sections will be updated)
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Style:</p>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="detailed" 
                id="detailed"
                checked={stylePreference === 'detailed'}
                onClick={() => setStylePreference('detailed')}
              />
              <Label htmlFor="detailed">Detailed</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="concise" 
                id="concise"
                checked={stylePreference === 'concise'}
                onClick={() => setStylePreference('concise')}
              />
              <Label htmlFor="concise">Concise</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="technical" 
                id="technical"
                checked={stylePreference === 'technical'}
                onClick={() => setStylePreference('technical')}
              />
              <Label htmlFor="technical">Technical</Label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={() => {
            startCascadeGeneration();
            onClose();
          }}>
            Regenerate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
```

### Alternatives Suggestion Component

```tsx
// Component for suggesting alternative versions of content
const AlternativeSuggestions: React.FC<{
  sectionId: string;
  documentId: string;
  onApply: (content: Descendant[]) => void;
  onClose: () => void;
}> = ({ sectionId, documentId, onApply, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [alternatives, setAlternatives] = useState<{
    id: string;
    content: Descendant[];
  }[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const { processAlternatives } = useAiAssistant(documentId);
  
  // Load alternatives on mount
  useEffect(() => {
    const loadAlternatives = async () => {
      try {
        setIsLoading(true);
        const result = await processAlternatives(sectionId, 3); // Generate 3 alternatives
        setAlternatives(result);
      } catch (err) {
        setError(err.message || 'Failed to generate alternatives');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAlternatives();
  }, [sectionId, documentId, processAlternatives]);
  
  return (
    <Card className="w-[500px] max-h-[600px] overflow-auto">
      <CardHeader className="py-3">
        <CardTitle className="text-sm">ALTERNATIVE SUGGESTIONS</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-6 w-6 p-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="py-2 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-center py-6 text-red-500">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {alternatives.map((alt, index) => (
              <div key={alt.id} className="space-y-2 p-3 border rounded-md hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Alternative {index + 1}</h3>
                  <Button
                    size="sm"
                    onClick={() => onApply(alt.content)}
                  >
                    Apply
                  </Button>
                </div>
                <div className="text-sm text-gray-700 max-h-[200px] overflow-auto p-2 bg-gray-50 rounded">
                  <SlatePreview value={alt.content} />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
```

## 4. Visual Transitions and Animations

### Animation Utilities

```typescript
// Animation utility for section transitions
const sectionTransitions = {
  // Fade in animation for new content
  fadeIn: (element: HTMLElement, duration: number = 300) => {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease-in-out`;
    
    // Force a reflow to ensure the initial state is applied
    void element.offsetWidth;
    
    element.style.opacity = '1';
    
    return new Promise<void>((resolve) => {
      const handleTransitionEnd = () => {
        element.removeEventListener('transitionend', handleTransitionEnd);
        resolve();
      };
      
      element.addEventListener('transitionend', handleTransitionEnd);
    });
  },
  
  // Slide down animation for expanding sections
  slideDown: (element: HTMLElement, duration: number = 300) => {
    const height = element.scrollHeight;
    element.style.height = '0';
    element.style.overflow = 'hidden';
    element.style.transition = `height ${duration}ms ease-in-out`;
    
    // Force a reflow to ensure the initial state is applied
    void element.offsetWidth;
    
    element.style.height = `${height}px`;
    
    return new Promise<void>((resolve) => {
      const handleTransitionEnd = () => {
        element.style.height = '';
        element.style.overflow = '';
        element.removeEventListener('transitionend', handleTransitionEnd);
        resolve();
      };
      
      element.addEventListener('transitionend', handleTransitionEnd);
    });
  },
  
  // Highlight animation for newly generated content
  highlight: (element: HTMLElement, duration: number = 1500) => {
    element.style.backgroundColor = 'rgba(124, 58, 237, 0.1)';
    element.style.transition = `background-color ${duration}ms ease-out`;
    
    // Force a reflow to ensure the initial state is applied
    void element.offsetWidth;
    
    setTimeout(() => {
      element.style.backgroundColor = 'transparent';
    }, 100);
    
    return new Promise<void>((resolve) => {
      setTimeout(resolve, duration);
    });
  }
};
```

### Section Animation Hook

```typescript
// Hook for applying animations to sections
const useSectionAnimation = () => {
  const sectionRefs = useRef<Record<string, React.RefObject<HTMLDivElement>>>({});
  
  // Get or create a ref for a section
  const getSectionRef = (sectionId: string) => {
    if (!sectionRefs.current[sectionId]) {
      sectionRefs.current[sectionId] = React.createRef<HTMLDivElement>();
    }
    return sectionRefs.current[sectionId];
  };
  
  // Animate a section when its content changes
  const animateSectionUpdate = async (sectionId: string) => {
    const ref = sectionRefs.current[sectionId];
    if (ref?.current) {
      await sectionTransitions.highlight(ref.current);
    }
  };
  
  // Animate expanding a section
  const animateSectionExpand = async (sectionId: string) => {
    const ref = sectionRefs.current[sectionId];
    if (ref?.current) {
      await sectionTransitions.slideDown(ref.current);
    }
  };
  
  // Animate new content appearing
  const animateNewContent = async (sectionId: string) => {
    const ref = sectionRefs.current[sectionId];
    if (ref?.current) {
      await sectionTransitions.fadeIn(ref.current);
    }
  };
  
  return {
    getSectionRef,
    animateSectionUpdate,
    animateSectionExpand,
    animateNewContent
  };
};
```

### Animated Section Component

```tsx
// Section component with animations
const AnimatedSection: React.FC<{
  section: DocumentSection;
  isActive: boolean;
  onToggle: () => void;
  onAiAssist: () => void;
}> = ({ section, isActive, onToggle, onAiAssist }) => {
  const { 
    getSectionRef, 
    animateSectionUpdate,
    animateSectionExpand 
  } = useSectionAnimation();
  
  const sectionRef = getSectionRef(section.id);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Animate when content changes
  const prevContent = useRef<string>(JSON.stringify(section.content));
  useEffect(() => {
    const currentContent = JSON.stringify(section.content);
    if (prevContent.current !== currentContent && section.content.length > 0) {
      animateSectionUpdate(section.id);
      prevContent.current = currentContent;
    }
  }, [section.content, section.id, animateSectionUpdate]);
  
  // Animate when section expands
  useEffect(() => {
    if (isActive && contentRef.current) {
      animateSectionExpand(section.id);
    }
  }, [isActive, section.id, animateSectionExpand]);
  
  return (
    <div ref={sectionRef} className="border-b border-gray-200 last:border-b-0">
      <SectionHeader
        id={section.id}
        title={section.title}
        isCompleted={section.isCompleted}
        isExpanded={isActive}
        onToggle={onToggle}
        onAiAssist={onAiAssist}
      />
      
      {isActive && (
        <div
          ref={contentRef}
          className="p-4 transition-all duration-300"
        >
          {section.content.length > 0 ? (
            <RichTextEditor
              value={section.content}
              onChange={(value) => updateSectionContent(section.id, value)}
              placeholder={`Enter ${section.title.toLowerCase()} here...`}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Click to add content or use AI assistant</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
```

## 5. Integration with Existing Architecture

### Document Controller Updates

The existing `useDocumentState` hook must be enhanced to support the auto-cascade and rich text features:

```typescript
// Updated document state hook
const useDocumentState = (documentId: string) => {
  // Existing state code...
  
  // Add support for rich text content
  const updateSectionContent = async (sectionId: string, content: Descendant[]) => {
    // Update local state immediately for responsive UI
    setDocument(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === sectionId 
          ? { 
              ...s, 
              content,
              isCompleted: content.length > 0 && !isEmptySlateContent(content)
            } 
          : s
      )
    }));
    
    // Debounced API update
    debouncedSaveSection(sectionId, content);
  };
  
  // Add support for cascade options
  const updateCascadeOptions = (options: Partial<CascadeOptions>) => {
    setCascadeOptions(prev => ({
      ...prev,
      ...options
    }));
  };
  
  // Calculate document completion progress
  const calculateProgress = useCallback(() => {
    if (!document || !document.sections.length) return 0;
    
    const completedSections = document.sections.filter(s => s.isCompleted).length;
    return Math.round((completedSections / document.sections.length) * 100);
  }, [document]);
  
  // Return enhanced state and functions
  return {
    // Existing returns...
    document,
    sections: document?.sections || [],
    updateSectionContent,
    calculateProgress,
    cascadeOptions,
    updateCascadeOptions
  };
};
```

### API Integration Updates

The existing API endpoints need to be enhanced to support the new features:

```typescript
// New API endpoints for cascade generation

// Process multiple sections in sequence
POST /api/flow-instances/:id/process-cascade
Body: {
  startFromSection: number;
  sectionIds: string[];
  preserveSections: string[];
  stylePreference: 'detailed' | 'concise' | 'technical';
}

// Generate alternative versions of a section
POST /api/flow-instances/:id/generate-alternatives
Body: {
  sectionId: string;
  count: number;
  stylePreference: 'detailed' | 'concise' | 'technical';
}

// Export document with formatting
POST /api/flow-instances/:id/export
Body: {
  format: 'pdf' | 'docx' | 'txt' | 'html';
  includeFormatting: boolean;
  includeMedia: boolean;
  template: string;
}
```

## 6. Implementation Phases

To implement the auto-cascade and rich text features, we recommend this phased approach:

### Phase 1: Core Auto-Cascade System (2 weeks)
1. Implement the basic cascade generation system
2. Create auto-generate button and progress indicators
3. Build section-by-section generation workflow
4. Integrate with existing AI assistance

### Phase 2: Rich Text Editor Integration (2-3 weeks)
1. Integrate Slate.js or TipTap editor
2. Implement basic text formatting (bold, italic, etc.)
3. Create section content serialization/deserialization
4. Add autosave functionality for rich text content

### Phase 3: Advanced Features (2-3 weeks)
1. Implement regeneration options and alternatives
2. Add table and image support
3. Create document preview modes
4. Implement section animations and transitions

### Phase 4: Export and Formatting (2 weeks)
1. Create PDF export with formatting
2. Implement Word document export
3. Add custom headers and footers
4. Create document templates

## 7. Testing Strategy

### Unit Tests
- Test cascade generation state management
- Verify rich text serialization/deserialization
- Validate animation utilities

### Integration Tests
- Test end-to-end cascade generation
- Verify content preservation during regeneration
- Test export functionality with formatting

### Performance Tests
- Measure response time for cascade generation
- Evaluate editor performance with large documents
- Test animations on various devices

This implementation guide provides detailed technical information for developers to build the auto-cascade feature with rich text editing capabilities, maintaining the document-centric interface with slim section boxes.