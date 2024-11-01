import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Auth($email: String!, $password: String!) {
    Auth {
      loginJwt(input: { email: $email, password: $password }) {
        loginResult {
          jwtTokens {
            accessToken
            refreshToken
          }
          firstLogin
        }
      }
    }
  }
`;
