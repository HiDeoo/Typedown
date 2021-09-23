import type { DefinitionChild, Definitions } from 'typedown-shared'

export function getDefinitionsMarkdown(definitions: Definitions): string {
  return definitions
    .map(
      (definition) => `# ${definition.name}

${getDefinitionChildrenMarkdown(definition.children)}`
    )
    .join('\n\n')
}

function getDefinitionChildrenMarkdown(children: DefinitionChild[]): string {
  return `| Name | Type | Optional |
| --- | --- | --- |
${children.map(getDefinitionChildMarkdown).join('\n')}`
}

function getDefinitionChildMarkdown(child: DefinitionChild): string {
  return `| ${child[0]} | \`${child[1]}\` | ${child[2] ? '✓' : ''} |`
}
