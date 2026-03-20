# hotel-booking

flowchart TD
  A[User Browser] -->|GET or POST| B[Express App app.js]

  subgraph Middleware Layer
    B --> C[Body Parser and Method Override]
    C --> D[Session Store connect-mongo]
    D --> E[Passport Auth]
    E --> F[Flash Messages]
  end

  F --> G{Route Group}

  subgraph Feature Routes
    G --> H[Listings Routes]
    G --> I[Reviews Routes Nested]
    G --> J[User Routes Login and Signup]
  end

  H --> K[Validation Joi schema.js]
  I --> K
  J --> K

  K --> L[Controllers listings.js reviews.js user.js]
  L --> M[Mongoose Models Listing Review User]
  M --> N[(MongoDB Atlas)]

  N --> O[Controller Response]
  O --> P[EJS Views and Partials]
  P --> A

  L --> Q{Error?}
  Q -->|Yes| R[ExpressError plus Global Error Handler]
  R --> S[Render listings/error.ejs]
  S --> A

  M --> T[Listing Hook Cascade Delete Reviews]
  T --> N

  classDef ui fill:#f7f1e3,stroke:#6b4f3a,stroke-width:1px,color:#2f241d;
  classDef core fill:#eaf4ff,stroke:#1e4d8f,stroke-width:1px,color:#102a43;
  classDef data fill:#eef9f1,stroke:#2d6a4f,stroke-width:1px,color:#1b4332;
  classDef warn fill:#fff1f2,stroke:#9f1239,stroke-width:1px,color:#4c0519;

  class A,P ui;
  class B,C,D,E,F,G,H,I,J,K,L core;
  class M,N,T data;
  class Q,R,S warn;
