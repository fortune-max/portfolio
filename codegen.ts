import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    schema: 'https://api-eu-central-1-shared-euc1-02.hygraph.com/v2/clfttr5oj35d101uncfop51nm/master',
    documents: ['app/**/*.graphql'],
    generates: {
        './app/generated/graphql.ts': {
            plugins: [
                'typescript',
                'typescript-operations',
                'typescript-graphql-request',
            ],
            config: {
                pureMagicComment: true,
                skipTypename: true,
            },
        },
    },
}

export default config
