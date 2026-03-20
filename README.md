flowchart TD
  A[User Browser] -->|GET or POST| B[Express App app.js]

  subgraph Middleware Layer
    B --> C[Body Parser and Method Override]
    C --> D[Session Store connect-mongo]
    D --> E[Passport Auth]
    E --> F[Flash Messages]
  end

  F --> G{Route Group}
