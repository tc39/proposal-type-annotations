# Modified productions

MemberExpression :
    > ...
    MemberExpression  `::`  TypeArguments
    MemberExpression  [no LineTerminator here]  `!`

CallExpression :
    > ...
    CallExpression  `::`  TypeArguments

OptionalChain :
    > ...
    OptionalChain  `::`  TypeArguments

RelationalExpression :
    > ...
    RelationalExpression  [no LineTerminator here]  `as`  Type
    RelationalExpression  [no LineTerminator here]  `as`  `const`

Declaration :
    > ...
    TypeDeclaration
    InterfaceDeclaration

LexicalBinding :
    BindingIdentifier  TypeAnnotation?  Initializer?
    BindingPattern  TypeAnnotation?  Initializer

VariableDeclaration :
    BindingIdentifier  TypeAnnotation?  Initializer?
    BindingPattern  TypeAnnotation?  Initializer

Catch :
    `catch`  `(`  CatchParameter  TypeAnnotation?  `)`  Block
    `catch`  Block

FormalParameter :
    BindingIdentifier  TypeAnnotation?  Initializer?
    BindingIdentifier  `?`  TypeAnnotation?
    BindingPattern  TypeAnnotation?  Initializer?

FunctionRestParameter :
    `...`  BindingIdentifier  TypeAnnotation?
    `...`  BindingPattern  TypeAnnotation?

FunctionDeclaration :
    `function`  BindingIdentifier  TypeParameters?  `(`  FormalParameters  `)`  TypeAnnotation?  `{`  FunctionBody  `}`

FunctionExpression :
    `function`  BindingIdentifier?  TypeParameters?  `(`  FormalParameters  `)`  TypeAnnotation?  `{`  FunctionBody  `}`

ArrowFunction :
    > ...
    ArrowParameters  TypeAnnotation  `=>`  ConciseBody

ArrowParameters :
    > ...
    TypeParameters  `(`  UniqueFormalParameters  `)`

MethodDefinition :
    ClassElementName  `?`?  TypeParameters?  `(`  UniqueFormalParameters  `)`  TypeAnnotation?  `{`  FunctionBody  `}`
    GeneratorMethod
    AsyncMethod
    AsyncGeneratorMethod
    `get`  ClassElementName  `(`  `)`  TypeAnnotation?  `{`  FunctionBody  `}`
    `set`  ClassElementName  `(`  PropertySetParameterList  `)`  `{`  FunctionBody  `}`

GeneratorDeclaration :
    `function`  `*`  BindingIdentifier  TypeParameters?  `(`  FormalParameters  `)`  TypeAnnotation?  `{`  GeneratorBody  `}`

GeneratorExpression :
    `function`  `*`  BindingIdentifier?  TypeParameters?  `(`  FormalParameters  `)`  TypeAnnotation?  `{`  GeneratorBody  `}`

GeneratorMethod :
    `*`  ClassElementName  `?`?  TypeParameters?  `(`  UniqueFormalParameters  `)`  TypeAnnotation?  `{`  GeneratorBody  `}`

AsyncGeneratorDeclaration :
    `async`  [no LineTerminator here]  `function`  `*`  BindingIdentifier  TypeParameters?  `(`  FormalParameters  `)`  TypeAnnotation?  `{`  AsyncGeneratorBody  `}`

AsyncGeneratorExpression :
    `async`  [no LineTerminator here]  `function`  `*`  BindingIdentifier?  TypeParameters?  `(`  FormalParameters  `)`  TypeAnnotation?  `{`  AsyncGeneratorBody  `}`

AsyncGeneratorMethod :
    `async`  [no LineTerminator here]  `*`  ClassElementName  `?`?  TypeParameters?  `(`  UniqueFormalParameters  `)`  TypeAnnotation?  `{`  AsyncGeneratorBody  `}`

ClassDeclaration :
    AbstractModifier?  `class`  BindingIdentifier  ClassTail

ClassExpression :
    AbstractModifier?  `class`  BindingIdentifier?  ClassTail

ClassHeritage :
    `extends`  LeftHandSideExpression  TypeArguments?  ClassImplementsClause?

FieldDefinition :
    ClassElementName  `?`?  TypeAnnotation?  Initializer?
    ClassElementName  `!`  TypeAnnotation?  Initializer?

ClassElement :
    AccessibilityModifier?  OverrideModifier?  MethodDefinition
    AccessibilityModifier?  `static`  OverrideModifier?  MethodDefinition
    AccessibilityModifier?  FieldDefinition
    AccessibilityModifier?  `static`  FieldDefinition
    ClassStaticBlock
    AbstractClassElement
    IndexSignature
    `;`

AsyncFunctionDeclaration :
    `async`  [no LineTerminator here]  `function`  BindingIdentifier  TypeParameters?  `(`  FormalParameters  `)`  TypeAnnotation?  `{`  AsyncFunctionBody  `}`

AsyncFunctionExpression :
    `async`  [no LineTerminator here]  `function`  BindingIdentifier?  TypeParameters?  `(`  FormalParameters  `)`  TypeAnnotation?  `{`  AsyncFunctionBody  `}`

AsyncMethod :
    `async`  [no LineTerminator here]  ClassElementName  `?`?  TypeParameters?  `(`  UniqueFormalParameters  `)`  TypeAnnotation?  `{`  AsyncFunctionBody  `}`

CoverCallExpressionAndAsyncArrowHead :
    MemberExpression  TypeParameters?  Arguments  TypeAnnotation?

AsyncArrowHead :
    `async`  [no LineTerminator here]  TypeParameters?  ArrowFormalParameters

ImportDeclaration :
    > ...
    `import`  `type`  ImportClause  FromClause  `;`

ImportSpecifier :
    > ...
    `type`  ImportedBinding
    `type`  ModuleExportName  `as`  ImportedBinding

# New productions

TypeArguments :
    AngleBracketedTokens

TypeDeclaration :
    `type`  BindingIdentifier  TypeParameters?  `=`  Type

TypeParameters :
    AngleBracketedTokens

Type :
    ConditionalType
    NonConditionalType

ConditionalType :
    NonConditionalType  [no LineTerminator here]  `extends`  NonConditionalType  `?`  Type  `:`  Type

NonConditionalType :
    UnionType
    FunctionType
    ConstructorType

UnionType :
    `|`?  IntersectionType
    UnionType  `|`  IntersectionType

IntersectionType :
    `&`?  TypeOperatorType
    IntersectionType  `&`  TypeOperatorType

TypeOperatorType :
    `readonly`  TypeOperatorType
    `keyof`  TypeOperatorType
    `unique`  TypeOperatorType
    `infer`  TypeOperatorType
    `not`  TypeOperatorType
    PrimaryType

PrimaryType :
    ParenthesizedType
    SquareBracketedType
    CurlyBracketedType
    TypeReference
    ArrayType
    LiteralType
    TypeQuery
    ImportType
    TypePredicate
    `this`
    `void`

ParenthesizedType :
    ParenthesizedTokens

SquareBracketedType :
    SquareBracketedTokens

CurlyBracketedType :
    CurlyBracketedTokens

TypeReference :
    TypeName  [no LineTerminator here]  TypeArguments?

TypeName :
    Identifier
    TypeName  `.`  Identifier

ArrayType :
    PrimaryType  [no LineTerminator here]  `[`  `]`

LiteralType :
    NumericLiteralType
    StringLiteral
    TemplateLiteralType
    `true`
    `false`
    `null`

TemplateLiteralType :
    NoSubstitutionTemplate
    TemplateBracketedTokens

NumericLiteralType :
    NumericLiteral
    `-`  [no LineTerminator here]  NumericLiteral

TypeQuery :
    `typeof`  [no LineTerminator here]  EntityName

EntityName :
    IdentifierName
    ImportSpecifier
    EntityName  `.`  IdentifierName
    EntityName  `::`  TypeArguments

ImportSpecifier :
    `import`  [no LineTerminator here]  `(`  ModuleSpecifier  `)`

ImportType :
    ImportSpecifier
    ImportSpecifier  `.`  TypeName

TypePredicate :
    IdentifierOrThis  [no LineTerminator here]  `is`  Type
    `asserts`  IdentifierOrThis
    `asserts`  IdentifierOrThis  [no LineTerminator here]  `is`  Type

IdentifierOrThis :
    Identifier
    `this`

FunctionType :
    TypeParameters?  ParameterList  `=>`  Type

ConstructorType :
    `new`  TypeParameters?  ParameterList  `=>`  Type

ParameterList :
    ParenthesizedTokens

InterfaceDeclaration :
    `interface`  BindingIdentifier  TypeParameters?  InterfaceExtendsClause?  InterfaceBody

InterfaceExtendsClause :
    `extends`  ClassOrInterfaceTypeList

ClassOrInterfaceTypeList :
    TypeReference
    ClassOrInterfaceTypeList  `,`  TypeReference

InterfaceBody :
    CurlyBracketedTokens

TypeAnnotation :
    `:`  Type

AbstractModifier :
    `abstract`

ClassImplementsClause :
    `implements`  ClassOrInterfaceTypeList

AccessibilityModifier :
    `public`
    `protected`
    `private`

OverrideModifier :
    `override`

AbstractClassElement :
    AccessibilityModifier?  `abstract`  OverrideModifier?  AbstractMethodDefinition
    AccessibilityModifier?  `abstract`  AbstractFieldDefinition

AbstractMethodDefinition :
    ClassElementName  TypeParameters?  `(`  UniqueFormalParameters  `)`  TypeAnnotation?
    `get`  ClassElementName  `(`  `)`  TypeAnnotation?
    `set`  ClassElementName  `(`  PropertySetParameterList  `)`

AbstractFieldDefinition :
    ClassElementName  `?`?  TypeAnnotation?

IndexSignature :
    `[`  BindingIdentifier  TypeAnnotation  `]`  TypeAnnotation

// New token section productions

BracketedTokens :
    ParenthesizedTokens
    SquareBracketedTokens
    CurlyBracketedTokens
    AngleBracketedTokens
    TemplateBracketedTokens

ParenthesizedTokens :
    `(`  TokenBody?  `)`

SquareBracketedTokens :
    `[`  TokenBody?  `]`

CurlyBracketedTokens :
    `{`  TokenBody?  `}`

AngleBracketedTokens :
    `<`  TokenBody?  `>`

TemplateBracketedTokens :
    TemplateHead  TemplateTokenBody  TemplateTail

TemplateTokenBody :
    TokenBody
    TokenBody  TemplateMiddle  TemplateTokenBody

TokenBody :
    TokenOrBracketedTokens  TokenBody?

TokenOrBracketedTokens :
    NonBracketedToken
    BracketedTokens

NonBracketedToken :
    Token but not one of `(` or `)` or `[` or `]` or `{` or `}` or `<` or `>` or TemplateHead or TemplateMiddle or TemplateTail
# Annotation type delimiters and allowed types

### How to define where the type annotation begins and ends

```ts
function foo(a : (this<is><x, y>TYPE!), b: thisIsAlso) {
  //..
}
```

*How does the JavaScript parser know where a type annotation begins?*

In the above example, as we defined, the `:` is used to indicate that a type begins. But how does it know that it
ends? In the above case, `(this<is><x, y>TYPE!)`, we can't just search for the comma, because
the type itself incorporates a `,`.

It's a bit unclear how to define this. Intuitively, it could be reasonable to parse tokens within matching parentheses and brackets (including `(...)`, `[...]`, `{...}`, or `<...>`), with the type ending when brackets are closed, but also permitting certain tokens to continue until a newline (if outside of a parenthesized region).

Some more complexity comes in in cases such as:
- How incompatible would this scheme be, given that it may prohibit newlines or require parentheses in certain cases?
- How do we avoid ambiguity with JSX, which uses `<...>` in a decidedly different way?


### Allowed types

Example of types that are allowed:

- Simple "identifier" style: `number`, `Foo`, `string`
- Adding `?`: `number?`, `?number`, `Foo?`
- Adding parentheses after an identifier: `string[]`, `Foo<T>`, `Foo<T extends ReturnType<Bar>>`
- Starting with parentheses: `{x: number, y: number}`, `{|x: number, y: number|}`, `(() => number)`


### Types under consideration

We're still considering how/whether the syntax could accommodate these cases without enclosing parentheses:

- Illegal characters in identifier: `number!`, `string | number`, `string & number`,
  `(x: number) => string`
- Multiple parentheses in sequence: `<T>(arg: T) => T`
- Unmatched parentheses: `Foo<T condition T < 5>`
- type operators: `typeof s`
- [Template literal types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html):
  `` `${EmailLocaleIDs | FooterLocaleIDs}_id` ``

#### Potential solution -  Proposal 

The above could be made legal by wrapping with `(...)`. Note that TypeScript, Flow, and Hegel all permit
parentheses in these contexts today:

- `(number!)`, `(string | number)`, `(string & number)`, `((x: number) => string)`
- `(<T>(arg: T) => T)`
- `(Foo<T condition T < 5>)`
- `(typeof s)`
- ``(`${EmailLocaleIDs | FooterLocaleIDs}_id`)``

> Note that this is a place where compatibility with _existing_ TypeScript code
  might not be provided. But that code can be easily fixed, probably even via a codemod, to conform to
  the restricted way of declaring a type, by wrapping the difficult-to-parse types with a `(...)`.