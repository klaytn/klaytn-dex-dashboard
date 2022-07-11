import { gql } from '@urql/core';

export const TokensSearchQuery = gql`
query TokensSearchQuery ($value: String) {
  byName: tokens(where: { name_contains_nocase: $value }) {
    id
    name
    symbol
  }
  bySymbol: tokens(where: { symbol_contains_nocase: $value }) {
    id
    name
    symbol
  }
  byAddress: tokens(where: { id: $value }) {
    id
    name
    symbol
  }
}
`;

export const PairsSearchQuery = gql`
query PairsSearchQuery ($id: String, $tokens: [ID]!) {
  byAddress: pairs(where: { id: $id }) {
    id
    name
  }
}
`;