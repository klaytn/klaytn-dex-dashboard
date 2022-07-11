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
query PairsSearchQuery ($id: String, $ids: [ID]!) {
  byAddress: pairs(where: { id: $id }) {
    id
    name
    token0 {
      id
    }
    token1 {
      id
    }
  }
  byToken0: pairs(where: { token0_in: $ids }) {
    id
    name
    token0 {
      id
    }
    token1 {
      id
    }
  }
  byToken1: pairs(where: { token1_in: $ids }) {
    id
    name
    token0 {
      id
    }
    token1 {
      id
    }
  }
}
`;