import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Auth($username: String!, $password: String!) {
    loginJwt(username: $username, password: $password) {
      token
      user {
        username
      }
    }
  }
`;
