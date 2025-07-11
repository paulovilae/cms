# Localization Documentation

This directory contains documentation about the localization process and resources for the multi-tenant CMS platform.

## Purpose

This documentation helps:
- Understand the localization architecture and workflow
- Maintain consistent translations across business units
- Document localization standards and best practices
- Track localization-related decisions and changes

## Localization Organization

The platform's localization files are located in the `/locales` directory:

```
locales/
├── en/          # English language resources
└── es/          # Spanish language resources
```

## Documentation Scope

This directory provides documentation **about** the localization process, while the actual localization files reside in the `/locales` directory. This separation maintains a clear distinction between the translation resources and their documentation.

### Topics Covered

- **Localization Architecture**: How the platform handles multiple languages
- **Translation Workflow**: Process for adding or updating translations
- **File Formats**: Standards for localization file formats
- **Key Naming Conventions**: Guidelines for consistent translation keys
- **Testing Procedures**: How to verify translations before deployment
- **Business-Specific Terminology**: Glossaries for specialized terms by business unit

## Multi-Tenant Localization

Each business unit may have specific localization needs:

- **Latinos**: Trading terminology in Spanish and English
- **Salarium**: HR terminology across supported languages
- **IntelliTrade**: Finance and blockchain terminology
- **Capacita**: Educational and training terminology

## Translation Guidelines

### Key Guidelines
- Use dot notation for hierarchical organization (e.g., `user.profile.title`)
- Keep keys descriptive and contextual (e.g., `button.save` not just `save`)
- Avoid hardcoded strings in the codebase
- Document context for translators when the meaning isn't obvious
- Include placeholders for dynamic content (e.g., `Hello, {name}`)

## Related Resources

- [Locales Directory](../../../locales/) - Actual localization files
- [Business-Specific Terminology](../../) - Business unit localization documentation
- [Internationalization Code](../../../src/components/LanguageSwitcher/) - Implementation details