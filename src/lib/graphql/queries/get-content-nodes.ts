import { gql } from "@apollo/client";

export const GET_CONTENT_NODES = gql`
  query Admin($offset: Int, $limit: Int) {
    Tree {
      GetContentNodes(offset: $offset, limit: $limit) {
        nodes {
          id
          structureDefinition {
            title
          }
        }
        totalCount
      }
    }
  }
`;
