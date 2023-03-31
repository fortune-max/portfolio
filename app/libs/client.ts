import { GraphQLClient } from 'graphql-request'
import { getSdk } from '~/generated/graphql'

export const GRAPHQL_ENDPOINT = 'https://api-eu-central-1-shared-euc1-02.hygraph.com/v2/clfttr5oj35d101uncfop51nm/master';

const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
    headers: {
        'Content-Type': 'application/json',
    },
});

export const sdk = getSdk(client)
