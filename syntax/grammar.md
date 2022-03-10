# Modified productions



MemberExpression :

&nbsp;&nbsp;&nbsp;&nbsp;<em>...</em>

&nbsp;&nbsp;&nbsp;&nbsp;MemberExpression  `::`  TypeArguments

&nbsp;&nbsp;&nbsp;&nbsp;MemberExpression  [no LineTerminator here]  `!`



CallExpression :

&nbsp;&nbsp;&nbsp;&nbsp;<em>...</em>

&nbsp;&nbsp;&nbsp;&nbsp;CallExpression  `::`  TypeArguments



OptionalChain :

&nbsp;&nbsp;&nbsp;&nbsp;<em>...</em>

&nbsp;&nbsp;&nbsp;&nbsp;OptionalChain  `::`  TypeArguments



RelationalExpression :

&nbsp;&nbsp;&nbsp;&nbsp;<em>...</em>

&nbsp;&nbsp;&nbsp;&nbsp;RelationalExpression  [no LineTerminator here]  `as`  Type

&nbsp;&nbsp;&nbsp;&nbsp;RelationalExpression  [no LineTerminator here]  `as`  `const`



Declaration :

&nbsp;&nbsp;&nbsp;&nbsp;<em>...</em>

&nbsp;&nbsp;&nbsp;&nbsp;TypeDeclaration

&nbsp;&nbsp;&nbsp;&nbsp;InterfaceDeclaration



LexicalBinding :

&nbsp;&nbsp;&nbsp;&nbsp;BindingIdentifier  TypeAnnotation?  Initializer?

&nbsp;&nbsp;&nbsp;&nbsp;BindingPattern  TypeAnnotation?  Initializer



VariableDeclaration :

&nbsp;&nbsp;&nbsp;&nbsp;BindingIdentifier  TypeAnnotation?  Initializer?

&nbsp;&nbsp;&nbsp;&nbsp;BindingPattern  TypeAnnotation?  Initializer



Catch :

&nbsp;&nbsp;&nbsp;&nbsp;`catch`  `(`  CatchParameter  TypeAnnotation?  `)`  Block

&nbsp;&nbsp;&nbsp;&nbsp;`catch`  Block



FormalParameter :

&nbsp;&nbsp;&nbsp;&nbsp;BindingIdentifier  TypeAnnotation?  Initializer?

&nbsp;&nbsp;&nbsp;&nbsp;BindingIdentifier  `?`  TypeAnnotation?

&nbsp;&nbsp;&nbsp;&nbsp;BindingPattern  TypeAnnotation?  Initializer?



FunctionRestParameter :

&nbsp;&nbsp;&nbsp;&nbsp;`...`  BindingIdentifier  TypeAnnotation?

&nbsp;&nbsp;&nbsp;&nbsp;`...`  BindingPattern  TypeAnnotation?



FunctionDeclaration :

&nbsp;&nbsp;&nbsp;&nbsp;`function`  BindingIdentifier  TypeParameters?  `(`  FormalParameters  `)`  TypeAnnotation?  `{`  FunctionBody  `}`



FunctionExpression :

&nbsp;&nbsp;&nbsp;&nbsp;`function`  BindingIdentifier?  TypeParameters?  `(`  FormalParameters  `)`  TypeAnnotation?  `{`  FunctionBody  `}`



ArrowFunction :

&nbsp;&nbsp;&nbsp;&nbsp;<em>...</em>

&nbsp;&nbsp;&nbsp;&nbsp;ArrowParameters  TypeAnnotation  `=>`  ConciseBody



ArrowParameters :

&nbsp;&nbsp;&nbsp;&nbsp;<em>...</em>

&nbsp;&nbsp;&nbsp;&nbsp;TypeParameters  `(`  UniqueFormalParameters  `)`



MethodDefinition :

&nbsp;&nbsp;&nbsp;&nbsp;ClassElementName  `?`?  TypeParameters?  `(`  UniqueFormalParameters  `)`  TypeAnnotation?  `{`  FunctionBody  `}`

&nbsp;&nbsp;&nbsp;&nbsp;GeneratorMethod

&nbsp;&nbsp;&nbsp;&nbsp;AsyncMethod

&nbsp;&nbsp;&nbsp;&nbsp;AsyncGeneratorMethod

&nbsp;&nbsp;&nbsp;&nbsp;`get`  ClassElementName  `(`  `)`  TypeAnnotation?  `{`  FunctionBody  `}`

&nbsp;&nbsp;&nbsp;&nbsp;`set`  ClassElementName  `(`  PropertySetParameterList  `)`  `{`  FunctionBody  `}`



GeneratorDeclaration :

&nbsp;&nbsp;&nbsp;&nbsp;`function`  `*`  BindingIdentifier  TypeParameters?  `(`  FormalParameters  `)`  TypeAnnotation?  `{`  GeneratorBody  `}`



GeneratorExpression :

&nbsp;&nbsp;&nbsp;&nbsp;`function`  `*`  BindingIdentifier?  TypeParameters?  `(`  FormalParameters  `)`  TypeAnnotation?  `{`  GeneratorBody  `}`



GeneratorMethod :

&nbsp;&nbsp;&nbsp;&nbsp;`*`  ClassElementName  `?`?  TypeParameters?  `(`  UniqueFormalParameters  `)`  TypeAnnotation?  `{`  GeneratorBody  `}`



AsyncGeneratorDeclaration :

&nbsp;&nbsp;&nbsp;&nbsp;`async`  [no LineTerminator here]  `function`  `*`  BindingIdentifier  TypeParameters?  `(`  FormalParameters  `)`  TypeAnnotation?  `{`  AsyncGeneratorBody  `}`



AsyncGeneratorExpression :

&nbsp;&nbsp;&nbsp;&nbsp;`async`  [no LineTerminator here]  `function`  `*`  BindingIdentifier?  TypeParameters?  `(`  FormalParameters  `)`  TypeAnnotation?  `{`  AsyncGeneratorBody  `}`



AsyncGeneratorMethod :

&nbsp;&nbsp;&nbsp;&nbsp;`async`  [no LineTerminator here]  `*`  ClassElementName  `?`?  TypeParameters?  `(`  UniqueFormalParameters  `)`  TypeAnnotation?  `{`  AsyncGeneratorBody  `}`



ClassDeclaration :

&nbsp;&nbsp;&nbsp;&nbsp;AbstractModifier?  `class`  BindingIdentifier  ClassTail



ClassExpression :

&nbsp;&nbsp;&nbsp;&nbsp;AbstractModifier?  `class`  BindingIdentifier?  ClassTail



ClassHeritage :

&nbsp;&nbsp;&nbsp;&nbsp;`extends`  LeftHandSideExpression  TypeArguments?  ClassImplementsClause?



FieldDefinition :

&nbsp;&nbsp;&nbsp;&nbsp;ClassElementName  `?`?  TypeAnnotation?  Initializer?

&nbsp;&nbsp;&nbsp;&nbsp;ClassElementName  `!`  TypeAnnotation?  Initializer?



ClassElement :

&nbsp;&nbsp;&nbsp;&nbsp;AccessibilityModifier?  OverrideModifier?  MethodDefinition

&nbsp;&nbsp;&nbsp;&nbsp;AccessibilityModifier?  `static`  OverrideModifier?  MethodDefinition

&nbsp;&nbsp;&nbsp;&nbsp;AccessibilityModifier?  FieldDefinition

&nbsp;&nbsp;&nbsp;&nbsp;AccessibilityModifier?  `static`  FieldDefinition

&nbsp;&nbsp;&nbsp;&nbsp;ClassStaticBlock

&nbsp;&nbsp;&nbsp;&nbsp;AbstractClassElement

&nbsp;&nbsp;&nbsp;&nbsp;IndexSignature

&nbsp;&nbsp;&nbsp;&nbsp;`;`



AsyncFunctionDeclaration :

&nbsp;&nbsp;&nbsp;&nbsp;`async`  [no LineTerminator here]  `function`  BindingIdentifier  TypeParameters?  `(`  FormalParameters  `)`  TypeAnnotation?  `{`  AsyncFunctionBody  `}`



AsyncFunctionExpression :

&nbsp;&nbsp;&nbsp;&nbsp;`async`  [no LineTerminator here]  `function`  BindingIdentifier?  TypeParameters?  `(`  FormalParameters  `)`  TypeAnnotation?  `{`  AsyncFunctionBody  `}`



AsyncMethod :

&nbsp;&nbsp;&nbsp;&nbsp;`async`  [no LineTerminator here]  ClassElementName  `?`?  TypeParameters?  `(`  UniqueFormalParameters  `)`  TypeAnnotation?  `{`  AsyncFunctionBody  `}`



CoverCallExpressionAndAsyncArrowHead :

&nbsp;&nbsp;&nbsp;&nbsp;MemberExpression  TypeParameters?  Arguments  TypeAnnotation?



AsyncArrowHead :

&nbsp;&nbsp;&nbsp;&nbsp;`async`  [no LineTerminator here]  TypeParameters?  ArrowFormalParameters



ImportDeclaration :

&nbsp;&nbsp;&nbsp;&nbsp;<em>...</em>

&nbsp;&nbsp;&nbsp;&nbsp;`import`  `type`  ImportClause  FromClause  `;`



ImportSpecifier :

&nbsp;&nbsp;&nbsp;&nbsp;<em>...</em>

&nbsp;&nbsp;&nbsp;&nbsp;`type`  ImportedBinding

&nbsp;&nbsp;&nbsp;&nbsp;`type`  ModuleExportName  `as`  ImportedBinding



# New productions



TypeArguments :

&nbsp;&nbsp;&nbsp;&nbsp;AngleBracketedTokens



TypeDeclaration :

&nbsp;&nbsp;&nbsp;&nbsp;`type`  BindingIdentifier  TypeParameters?  `=`  Type



TypeParameters :

&nbsp;&nbsp;&nbsp;&nbsp;AngleBracketedTokens



Type :

&nbsp;&nbsp;&nbsp;&nbsp;ConditionalType

&nbsp;&nbsp;&nbsp;&nbsp;NonConditionalType



ConditionalType :

&nbsp;&nbsp;&nbsp;&nbsp;NonConditionalType  [no LineTerminator here]  `extends`  NonConditionalType  `?`  Type  `:`  Type



NonConditionalType :

&nbsp;&nbsp;&nbsp;&nbsp;UnionType

&nbsp;&nbsp;&nbsp;&nbsp;FunctionType

&nbsp;&nbsp;&nbsp;&nbsp;ConstructorType



UnionType :

&nbsp;&nbsp;&nbsp;&nbsp;`|`?  IntersectionType

&nbsp;&nbsp;&nbsp;&nbsp;UnionType  `|`  IntersectionType



IntersectionType :

&nbsp;&nbsp;&nbsp;&nbsp;`&`?  TypeOperatorType

&nbsp;&nbsp;&nbsp;&nbsp;IntersectionType  `&`  TypeOperatorType



TypeOperatorType :

&nbsp;&nbsp;&nbsp;&nbsp;`readonly`  TypeOperatorType

&nbsp;&nbsp;&nbsp;&nbsp;`keyof`  TypeOperatorType

&nbsp;&nbsp;&nbsp;&nbsp;`unique`  TypeOperatorType

&nbsp;&nbsp;&nbsp;&nbsp;`infer`  TypeOperatorType

&nbsp;&nbsp;&nbsp;&nbsp;`not`  TypeOperatorType

&nbsp;&nbsp;&nbsp;&nbsp;PrimaryType



PrimaryType :

&nbsp;&nbsp;&nbsp;&nbsp;ParenthesizedType

&nbsp;&nbsp;&nbsp;&nbsp;SquareBracketedType

&nbsp;&nbsp;&nbsp;&nbsp;CurlyBracketedType

&nbsp;&nbsp;&nbsp;&nbsp;TypeReference

&nbsp;&nbsp;&nbsp;&nbsp;ArrayType

&nbsp;&nbsp;&nbsp;&nbsp;LiteralType

&nbsp;&nbsp;&nbsp;&nbsp;TypeQuery

&nbsp;&nbsp;&nbsp;&nbsp;ImportType

&nbsp;&nbsp;&nbsp;&nbsp;TypePredicate

&nbsp;&nbsp;&nbsp;&nbsp;`this`

&nbsp;&nbsp;&nbsp;&nbsp;`void`



ParenthesizedType :

&nbsp;&nbsp;&nbsp;&nbsp;ParenthesizedTokens



SquareBracketedType :

&nbsp;&nbsp;&nbsp;&nbsp;SquareBracketedTokens



CurlyBracketedType :

&nbsp;&nbsp;&nbsp;&nbsp;CurlyBracketedTokens



TypeReference :

&nbsp;&nbsp;&nbsp;&nbsp;TypeName  [no LineTerminator here]  TypeArguments?



TypeName :

&nbsp;&nbsp;&nbsp;&nbsp;Identifier

&nbsp;&nbsp;&nbsp;&nbsp;TypeName  `.`  Identifier



ArrayType :

&nbsp;&nbsp;&nbsp;&nbsp;PrimaryType  [no LineTerminator here]  `[`  `]`



LiteralType :

&nbsp;&nbsp;&nbsp;&nbsp;NumericLiteralType

&nbsp;&nbsp;&nbsp;&nbsp;StringLiteral

&nbsp;&nbsp;&nbsp;&nbsp;TemplateLiteralType

&nbsp;&nbsp;&nbsp;&nbsp;`true`

&nbsp;&nbsp;&nbsp;&nbsp;`false`

&nbsp;&nbsp;&nbsp;&nbsp;`null`



TemplateLiteralType :

&nbsp;&nbsp;&nbsp;&nbsp;NoSubstitutionTemplate

&nbsp;&nbsp;&nbsp;&nbsp;TemplateBracketedTokens



NumericLiteralType :

&nbsp;&nbsp;&nbsp;&nbsp;NumericLiteral

&nbsp;&nbsp;&nbsp;&nbsp;`-`  [no LineTerminator here]  NumericLiteral



TypeQuery :

&nbsp;&nbsp;&nbsp;&nbsp;`typeof`  [no LineTerminator here]  EntityName



EntityName :

&nbsp;&nbsp;&nbsp;&nbsp;IdentifierName

&nbsp;&nbsp;&nbsp;&nbsp;ImportSpecifier

&nbsp;&nbsp;&nbsp;&nbsp;EntityName  `.`  IdentifierName

&nbsp;&nbsp;&nbsp;&nbsp;EntityName  `::`  TypeArguments



ImportSpecifier :

&nbsp;&nbsp;&nbsp;&nbsp;`import`  [no LineTerminator here]  `(`  ModuleSpecifier  `)`



ImportType :

&nbsp;&nbsp;&nbsp;&nbsp;ImportSpecifier

&nbsp;&nbsp;&nbsp;&nbsp;ImportSpecifier  `.`  TypeName



TypePredicate :

&nbsp;&nbsp;&nbsp;&nbsp;IdentifierOrThis  [no LineTerminator here]  `is`  Type

&nbsp;&nbsp;&nbsp;&nbsp;`asserts`  IdentifierOrThis

&nbsp;&nbsp;&nbsp;&nbsp;`asserts`  IdentifierOrThis  [no LineTerminator here]  `is`  Type



IdentifierOrThis :

&nbsp;&nbsp;&nbsp;&nbsp;Identifier

&nbsp;&nbsp;&nbsp;&nbsp;`this`



FunctionType :

&nbsp;&nbsp;&nbsp;&nbsp;TypeParameters?  ParameterList  `=>`  Type



ConstructorType :

&nbsp;&nbsp;&nbsp;&nbsp;`new`  TypeParameters?  ParameterList  `=>`  Type



ParameterList :

&nbsp;&nbsp;&nbsp;&nbsp;ParenthesizedTokens



InterfaceDeclaration :

&nbsp;&nbsp;&nbsp;&nbsp;`interface`  BindingIdentifier  TypeParameters?  InterfaceExtendsClause?  InterfaceBody



InterfaceExtendsClause :

&nbsp;&nbsp;&nbsp;&nbsp;`extends`  ClassOrInterfaceTypeList



ClassOrInterfaceTypeList :

&nbsp;&nbsp;&nbsp;&nbsp;TypeReference

&nbsp;&nbsp;&nbsp;&nbsp;ClassOrInterfaceTypeList  `,`  TypeReference



InterfaceBody :

&nbsp;&nbsp;&nbsp;&nbsp;CurlyBracketedTokens



TypeAnnotation :

&nbsp;&nbsp;&nbsp;&nbsp;`:`  Type



AbstractModifier :

&nbsp;&nbsp;&nbsp;&nbsp;`abstract`



ClassImplementsClause :

&nbsp;&nbsp;&nbsp;&nbsp;`implements`  ClassOrInterfaceTypeList



AccessibilityModifier :

&nbsp;&nbsp;&nbsp;&nbsp;`public`

&nbsp;&nbsp;&nbsp;&nbsp;`protected`

&nbsp;&nbsp;&nbsp;&nbsp;`private`



OverrideModifier :

&nbsp;&nbsp;&nbsp;&nbsp;`override`



AbstractClassElement :

&nbsp;&nbsp;&nbsp;&nbsp;AccessibilityModifier?  `abstract`  OverrideModifier?  AbstractMethodDefinition

&nbsp;&nbsp;&nbsp;&nbsp;AccessibilityModifier?  `abstract`  AbstractFieldDefinition



AbstractMethodDefinition :

&nbsp;&nbsp;&nbsp;&nbsp;ClassElementName  TypeParameters?  `(`  UniqueFormalParameters  `)`  TypeAnnotation?

&nbsp;&nbsp;&nbsp;&nbsp;`get`  ClassElementName  `(`  `)`  TypeAnnotation?

&nbsp;&nbsp;&nbsp;&nbsp;`set`  ClassElementName  `(`  PropertySetParameterList  `)`



AbstractFieldDefinition :

&nbsp;&nbsp;&nbsp;&nbsp;ClassElementName  `?`?  TypeAnnotation?



IndexSignature :

&nbsp;&nbsp;&nbsp;&nbsp;`[`  BindingIdentifier  TypeAnnotation  `]`  TypeAnnotation



// New token section productions



BracketedTokens :

&nbsp;&nbsp;&nbsp;&nbsp;ParenthesizedTokens

&nbsp;&nbsp;&nbsp;&nbsp;SquareBracketedTokens

&nbsp;&nbsp;&nbsp;&nbsp;CurlyBracketedTokens

&nbsp;&nbsp;&nbsp;&nbsp;AngleBracketedTokens

&nbsp;&nbsp;&nbsp;&nbsp;TemplateBracketedTokens



ParenthesizedTokens :

&nbsp;&nbsp;&nbsp;&nbsp;`(`  TokenBody?  `)`



SquareBracketedTokens :

&nbsp;&nbsp;&nbsp;&nbsp;`[`  TokenBody?  `]`



CurlyBracketedTokens :

&nbsp;&nbsp;&nbsp;&nbsp;`{`  TokenBody?  `}`



AngleBracketedTokens :

&nbsp;&nbsp;&nbsp;&nbsp;`<`  TokenBody?  `>`



TemplateBracketedTokens :

&nbsp;&nbsp;&nbsp;&nbsp;TemplateHead  TemplateTokenBody  TemplateTail



TemplateTokenBody :

&nbsp;&nbsp;&nbsp;&nbsp;TokenBody

&nbsp;&nbsp;&nbsp;&nbsp;TokenBody  TemplateMiddle  TemplateTokenBody



TokenBody :

&nbsp;&nbsp;&nbsp;&nbsp;TokenOrBracketedTokens  TokenBody?



TokenOrBracketedTokens :

&nbsp;&nbsp;&nbsp;&nbsp;NonBracketedToken

&nbsp;&nbsp;&nbsp;&nbsp;BracketedTokens



NonBracketedToken :

&nbsp;&nbsp;&nbsp;&nbsp;Token but not one of `(` or `)` or `[` or `]` or `{` or `}` or `<` or `>` or TemplateHead or TemplateMiddle or TemplateTail
