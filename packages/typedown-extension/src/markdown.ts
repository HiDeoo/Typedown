import type { DefinitionChild, Definitions } from 'typedown-shared'
import prettier from 'prettier/standalone'
import parserMarkdown from 'prettier/parser-markdown'

export function getDefinitionsMarkdown(definitions: Definitions): string {
  const markdown = definitions
    .map(
      (definition) => `# ${definition.name}

${getDefinitionChildrenMarkdown(definition.children)}`
    )
    .join('\n\n')

  return formatMarkdown(markdown)
}

export function escapeMarkdown(markdown: string): string {
  return markdown.replace(/\|/, '\\|')
}

export function formatMarkdown(markdown: string): string {
  return prettier.format(markdown, { parser: 'markdown', plugins: [parserMarkdown] })
}

function getDefinitionChildrenMarkdown(children: DefinitionChild[]): string {
  return `| Name | Description | Type | Optional | Default value |
| --- | --- | --- | --- | --- |
${children.map(getDefinitionChildMarkdown).join('\n')}`
}

function getDefinitionChildMarkdown(child: DefinitionChild): string {
  const components = [
    child[0],
    escapeMarkdown(child[1]),
    `\`${escapeMarkdown(child[2])}\``,
    child[3] ? '✓' : '',
    escapeMarkdown(child[4]),
  ]

  return `| ${components.join(' | ')} |`
}
