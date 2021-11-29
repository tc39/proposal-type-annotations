// @ts-check
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {writeFileSync} from "fs"
import {DevWebSocket, Entry, FAQ, Header, setupShikiTwoslash, Split, SplitReverse, Code, TwoThirdsHeading, CenterOneColumn} from "./components.jsx"

const Page = () => <html lang="en">
    <head>
        <meta charSet="utf-8"/>
        <title>TC39 Proposal: Types as Comments</title>
        <meta name="description" content="Reserve a space for static type syntax inside the ECMAScript language. JavaScript engines would treat type syntax as comments." />
        <meta property="og:title" content="TC39 Proposal: Types as Comments" />
        <meta property="og:type" content="article" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        {/* This needs changing on deploy */}
        <meta property="og:image" content="https://confident-galileo-43471d.netlify.app/assets/og-image.png" />
        <link rel="icon" type="image/png"  href="./assets/favicon.png" />
        <meta name="twitter:site" content="@tc39" />
        <meta name="twitter:creator" content="@tc39" />
        <meta name="theme-color" content="#fc7c00" />
        <meta name="msapplication-TileColor" content="#fc7c00" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style id="style" />
        <DevWebSocket/>
      </head>
    <body>

      <Header>
        <h1>Types <em>// as Comments</em></h1>
        <p>ECMAScript Proposal</p>
      </Header>
      
      <hr />
      <TwoThirdsHeading name="Goal" body="Reserve a space for static type syntax inside the ECMAScript language. JavaScript engines would treat type syntax as comments."/>

      <Split>
        <div>
          <Code title="Before" after="Runs with tools, crashes in a browser" lang='ts twoslash' emoji='💥' emojiName="explosion emoji to indicate the code failed">{`
            const message: string = "<h2> types"
            console.log(message)
            // @error: SyntaxError: Unexpected token ':'. const declared variable 'message' must have an initializer.`}
          </Code>
        </div>
        <div>
          <Code title="After" after="Runs without tools, runs in a browser" lang='ts twoslash' emoji='✅' emojiName='tick to indicate it passed'>{`
            const message: string = "Hello, types"
            console.log(message)`}
          </Code>
        </div>
      </Split>


      <p>The Types as Comments proposal aims to simplify working in a modern JavaScript codebase.  With Types as Comments, developers can remove a build phase from their apps, keeping TypeScript and Flow codebases aligned with JavaScript. This proposal does not precisely specify a type syntax, which opens the door to many potential type systems in JavaScript.</p>

      <h2>How the proposal works</h2>
      <aside>Note: this is a simplification for the purposes of understanding the ideas behind Types as Comments.</aside>

      <Split>
        <Code lang="ts twoslash">{`
          const message = "Hello, types"

          /* Echo the message */
          console.log(message)
          // @log: Hello, types`}
        </Code>
        <div>
          <p>Today, a JavaScript engine knows that a backslash and a star (<code>/*</code>) indicates the start of a multi-line comment.</p>
          <p>Which to the engine is roughly: <em>'from this point in the code move onwards ignoring the characters until you find a star with a backslash right after <code>*/</code>'  </em>.</p>
        </div>
      </Split>

      <Split>
        <Code lang="ts twoslash">{`
          const message: string = "Hello, types"

          /* Echo the message */
          console.log(message)
          // @log: Hello, types`}
          </Code>
        <div>
          <p>For the simplest case, the same idea could be applied to an engine which implements Type as Comments. </p>
          <p>If the engine has just seen an identifier like '<code>message</code>' and the next character is a colon (<code>:</code>), then treat the colon (<code>:</code>) and the next word of characters ('<code>: string</code>') as a comment.</p>
          <p>Once the engine hits the <code>=</code>'s then stop treating the code as comments and continue to create runtime code.</p>
        </div>
      </Split>

      <CenterOneColumn>
        <p><em>To the JavaScript runtime, the runtime code would look like this:</em></p>
        <div className="highlight-remove">
          <Code lang="ts twoslash">{`
            const message         = "Hello, types"

            
            console.log(message)
            // @log: Hello, types`}
          </Code>
          <p>The underlying implementation would need to be a more complex than that, for example to handle object literal syntax (<code>{`{ id: string }`}</code>) the engine would keep track of open and close braces.</p>
          <p>The goal of the proposal is to provide a way to describe how to safely ignore type-like code inside the JavaScript language.</p>
        </div>
      </CenterOneColumn>

      {/* <SplitReverse>
        <div>
          <p>The underlying implementation would need to be a more complex than that, for example it to handle object literal syntax the parser would keep track of open and close braces.</p>
        </div>
        <div>
          <Code lang="ts twoslash">{`            
            const input: { [key: string]: boolean | Horse } = { 
              del: true,
              rodney: false,
            }

            console.log(input.name)
            // @log: Hello, Zagreus`}
          </Code>

          <Code lang="ts twoslash">{`
            const input: ({ name: string })  = { 
              name: "Zagreus"
            }
            
            console.log(input.name)
            // @log: Hello, Zagreus`}
          </Code>
        </div>
      </SplitReverse> */}


      <h2>Who benefits?</h2>
      <Split>
        
        <article>
          <h4>JavaScript Users</h4>
          <p>Greatly reduces the need for source code transformation in modern JavaScript projects.</p>
          <p>Cleaner and more powerful syntax than JSDoc comments.</p>
          <p>Allows users of existing static type systems to migrate back towards source code alignment with JavaScript.</p>
          <p>Pasting typed code into the console just works.</p>
        </article>

        <article>
          <h4>Tool Makers</h4>
          <p>New experimental type systems can be built using the ignored syntax space.</p>
          <p>Existing JavaScript tools can:</p>
          <ul>
            <li>Skip source-code changes</li>
            <li>Avoid duplicate transpiled files</li>
            <li>Reduce the need for sourcemaps</li>
            <li>Simplify file resolvers</li>
            <li>Use one parsing strategy</li>
          </ul>
        </article>

        <article>
          <h4>Engine Maintainers</h4>
          <p>Browser engines do not pay any type-checking cost at runtime. </p>
          <p>Engine maintainers avoid the burden of parser upgrades as each type system evolves.</p>
        </article>
      </Split>

      <h2>Frequently Asked Questions</h2>
      <aside>There is a comprehensive FAQ in the proposal itself, but these Q&amp;As I expect cover most JS users questions.</aside>

      <FAQ>
        <Entry title="What type syntax is proposed?">
          <p>Type definitions on functions and variable declarations, import/exporting types, class field and methods, generics, function overloads,  `as X` type assertions, this parameters and more.</p>
        </Entry>

        <Entry title="Will JavaScript engines perform type-checking?">
          <p>No, the goal is to let projects like TypeScript, Flow and others provide the type system and check the code for type errors. JavaScript would only reserve a space in the JavaScript syntax for their type syntax to exist.</p>
        </Entry>

        <Entry title="Will adding types slow down my JavaScript programs?">
          <p>Like any new JavaScript feature, it would have performance trade-offs but the performance changes to JavaScript code would be is comparable to the performance hit in writing a comment in your code.</p>
          <p>Basically, no</p>
        </Entry>

        <Entry title="Will this grow JavaScript bundle sizes?">
          <p>It could, but if you are already bundling then you would have the types removed during that bundling process. Negating the issue for most apps where bundle size is a concern.</p>
          <p>JavaScript files without a build-step would have more characters as a result of the types. This is the same trade-off as adding comments to files, and the same solutions apply, e.g. use a minifier.</p>
        </Entry>

        <Entry title="How does this differ from JSDoc support in editors?">
          <p>Today JavaScript users use JSDoc syntax with tooling in order to create a type-system in JavaScript code without a build step. </p>
          <p>The syntax for JSDoc support is intentionally more verbose than type syntax, and is less ergonomic for complex typing as it is a documentation format. With this proposal, you can get JSDoc-like 'works without build tools' without the constraint of specially formatted comments.</p>
        </Entry>

        <Entry title="Does this proposal favour TypeScript?">
          <p>The proposal favors TypeScript/Flow-like syntax inside JavaScript, and is strongly influenced by syntax which is common to both language extensions. The aim is to also leave the door open for new syntax extensions which haven't been anticipated yet.</p>
          <p>That said, the language in this specification favours TypeScript as it is the most popular type-system, but nearly all of the proposed syntax spaces would benefit Flow users too.</p>
        </Entry>

        <Entry title="Is there prior art?">
          <p>Python similarly implements support for opt-in type-checking.  However this proposal has a stronger stance of relying solely on type erasure. Ruby is quite similar too.</p>
        </Entry>  

        <Entry title="Will this slow down JavaScript's evolution?">
          <p>JavaScript's backwards compatibility goals of never breaking old code means that this is something future JavaScript syntax improvements would need to take into account. It is unlikely to get in the way of most new syntax however, as it is a strictly specified gap in the language instead of code which runs.</p>
        </Entry>  

        <Entry title="How does this affect runtime error messaging?">
          <p>JavaScript today throws <code>SyntaxError</code> messages when it has evaluated invalid syntax. This will still be the same after the proposal, except for invalid code inside the areas designated for Types as Comments.</p>
          <p>For example this typo in `message` would raise an error:</p>
          <Code lang="js twoslash">{`
            const mes sage: string = "Hello, types"
            // @error: SyntaxError: Unexpected token ':'. const declared variable 'message' must have an initializer.
// @noErrors`}
          </Code>
          <p>Versus this 'error' in the types space (in TypeScript / Flow):</p>
          <Code lang="ts">{`
            const message: { abc=123 } = "Hello, types"`}
          </Code>
          <p>Which would run perfectly fine in a JavaScript engine supporting this proposal, but TypeScript or Flow would show their own errors. </p>
          <p>The proposal leaves type space errors to the IDE and type checker to declare the code inside the types are invalid, not the JavaScript runtime.</p>
        </Entry>

         <Entry title="I'm new, what are these terms?">
          <p>JavaScript is a language which does not provide a way to declare the input/outputs of your code. For example in JavaScript a let variable can be set to a string, number, object or more. </p>
          <p>JavaScript extensions like TypeScript and Flow exist to add new syntax which have a way to declare 'this let variable can only be a string.'</p>
          <p>The value in adding these extra definitions is that tooling can make better assumptions about how your code works and doesn't. That tooling can live in your IDE, or be a command-line app.</p>
          <p>The process of verifying these assumptions is called type checking, and for JavaScript there are different type checkers with different trade-offs about how JavaScript code can be validated.</p>
          <p>Prior to this proposal, you needed a tool like Babel or TypeScript to remove those definitions, after this proposal you do not need a build tool to remove them. </p>
          <p>Removing this step can help simplify working in JavaScript projects to the point where you may not need any build tooling at all.</p>
        </Entry>
      </FAQ>

      <h2>TypeScript Specific Frequently Asked Questions</h2>
      <aside>Note: There is also <a href= "tbd.com">a TypeScript Blog Post</a> on the topic.</aside>
      <FAQ>
        <Entry title="Will all of TypeScript be supported by this proposal">
          <p>No, not all of today's TypeScript syntax would be supported by this proposal. This is similar to how Babel support for TypeScript does not support all of the existing TypeScript syntax. </p>
          <p>For example enums, namespaces and class parameter properties are unlikely to be supported.</p>
        </Entry>

        <Entry title="How could I convert my TypeScript codebase to Types as Comments JavaScript?">
          <p>It's likely that TypeScript will have a tsconfig flag which indicates that you want your files to be given the additional constraints  imposed by Types as Comments. </p>
          <p>This means you can migrate your code incrementally as .ts files before converting them to .js files.</p>
        </Entry>

        <Entry title="How does this differ from JSDoc support?">
          <p>JSDoc tried to solve the same problem as this proposal by the type information actually inside comments! Given the constraints of not being able to change the JavaScript language, this was a good compromise between wanting the code to be regular JavaScript while still type checking it via the TypeScript checker.</p>
          <p>This proposal has no such constraints, and thus does not need to compromise. This proposal allows you to have the cake ("It's just JavaScript") and eat it too ("I want to check the types"). You get all the benefits of TypeScript's JSDoc support, but without the awkward syntax.</p>
        </Entry>

        <Entry title="Do I need to migrate?">
          <p>No, TypeScript has backwards compatibility guarantees which means you can continue to use .ts and .tsx files for TypeScript.</p>
        </Entry>
      </FAQ>

      <h2>Links</h2>
      <aside>This page is a simpler overview of Types as Comments, to learn more about the proposal consult the GitHub repo.</aside>
      <Split>
        <a className="button" href="https://github.com/tc39/proposal-types-as-comments#motivations">
          <h5>Motivations</h5>
          <p>How does this proposal improve the JavaScript ecosystem as a whole?</p>
        </a>

        <a className="button" href="https://github.com/tc39/proposal-types-as-comments#proposal">
          <h5>Supported Syntax</h5>
          <p>From types definitions to class properties, see all the proposed supported type-level syntax.</p>
        </a>

        <a className="button" href="https://github.com/tc39/proposal-types-as-comments#FAQ">
          <h5>Frequently Asked Questions</h5>
          <p>How does this proposal relate to TypeScript or Flow support? and many other questions.</p>
        </a>
      </Split>

  </body>
</html>


// This code is evaluated during the build and triggers saving the .html
const go = async () => {
  await setupShikiTwoslash({ theme: "github-light"})
  const html = ReactDOMServer.renderToStaticMarkup(<Page />)
  writeFileSync("./out/index.html", html)
}
go()