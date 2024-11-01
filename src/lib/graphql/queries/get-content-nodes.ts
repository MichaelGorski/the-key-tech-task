import { gql } from "@apollo/client";

export const GET_CONTENT_NODES = gql`
  query GetNodes {
    Admin {
      Tree {
        GetContentNodes {
          edges {
            node {
              structureDefinition {
                title
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  }
`;
