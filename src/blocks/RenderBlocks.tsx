import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'

// Import new block components
import { ParallaxHero } from '@/blocks/ParallaxHero/Component'
import { AnimatedTimeline } from '@/blocks/AnimatedTimeline/Component'
import { FeatureGrid } from '@/blocks/FeatureGrid/Component'
import { StatCounter } from '@/blocks/StatCounter/Component'
import { FloatingCTA } from '@/blocks/FloatingCTA/Component'
import { Component as SmartContractDemoBlock } from '@/blocks/SmartContractDemo/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  // Add new blocks
  'parallax-hero': ParallaxHero,
  'animated-timeline': AnimatedTimeline,
  'feature-grid': FeatureGrid,
  'stat-counter': StatCounter,
  'floating-cta': FloatingCTA,
  'smart-contract-demo': SmartContractDemoBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
