import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Auth {
    loginJwt {
      token
    }
  }
`;
