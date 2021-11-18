// @ts-check
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {writeFileSync} from "fs"
import {DevWebSocket, Entry, FAQ, Header, setupShikiTwoslash, Split, SplitReverse, Code, TwoThirdsHeading} from "./components.jsx"

const Page = () => <html lang="en">
    <head>
        <title>TC39 Proposal: Types as Comments</title>
        <meta name="description" content="Reserve a space for static type syntax inside the ECMAScript language. JavaScript engines would treat type syntax as comments" />
        <meta property="og:title" content="TC39 Proposal: Types as Comments" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="<!---TBD-->" />
        <meta property="og:image" content="https://shikijs.github.io/twoslash/img/ograph.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:site" content="@tc39" />
        <meta name="twitter:creator" content="@tc39" />
        <meta name="theme-color" content="#fcf3d9" />
        <meta name="msapplication-TileColor" content="#fcf3d9" />
        <style id="style" />
        <DevWebSocket/>
      </head>
    <body>

      <Header title="Types // as Comments" subtitle='ECMAScript - 202X'/>
      <hr />
      <TwoThirdsHeading name="Goal" body="Reserve a space for static type syntax inside the ECMAScript language. JavaScript engines would treat type syntax as comments."/>

      <Split>
        <div>
          <h4>Before</h4>
          <Code lang='ts twoslash'>{`
            const message: string = "Hello, types"
            console.log(message)
            // @error: SyntaxError: Unexpected token ':'. const declared variable 'message' must have an initializer.`}
          </Code>
        </div>
        <div>
          <h4>After</h4>
          <Code lang='ts twoslash'>{`
            const message: string = "Hello, types"
            console.log(message)`}
          </Code>
        </div>
      </Split>

      <p>The Types as Comments proposal aims to simplify working in a modern JavaScript codebase. With Types as Comments, JavaScript developers can potentially remove a build phase from their apps, keep typed-JavaScript codebases aligned with JavaScript and opens the door for different static type systems in JavaScript.</p>

      <h2>How the proposal works</h2>
      <aside>Note that this is a simplification for the purposes of understanding the ideas behind Types as Comments.</aside>

      <Split>
        <Code lang="ts twoslash">{`
          const message = "Hello, types"

          /* Echo the message */
          console.log(message)
          // @log: Hello, types`}
        </Code>
        <div>
          <p>Today, a JavaScript parser knows that a backslash and a star (<code>/*</code>) indicates the start of a multi-line comment.</p>
          <p>Which to the parser is roughly: <em>'from here in the text move onwards ignoring the characters until you find a star and then a backslash right after <code>*/</code>'</em>.</p>
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
          <p>For the simplest case, the same idea could be applied to a parser which implements Type as Comments. </p>
          <p>If the parser has just parsed an identifier like 'message' and the next character is a colon, then treat the colon and the next word of characters ('string') as a comment.</p>
          <p>Once the parser hits the '='s then stop treating the code as comments and continue to create runtime code.</p>
        </div>
      </Split>

      <div>
        <p><em>To the JavaScript runtime, the above code would look like this:</em></p>
        <div className="highlight-remove">
          <Code lang="ts twoslash">{`
            const message: string = "Hello, types"
            //           ^^^^^^^^

            /* Echo the message */
            console.log(message)
            // @log: Hello, types`}
          </Code>
        </div>
      </div>

      <SplitReverse>
        <Code lang="ts twoslash">{`
          const input: { name: string } = { 
            name: "Zagreus"
          }

          console.log(input.name)`}
        </Code>
        <div>
          <p>The underlying implementation would need to be a more complex than that, for example it to handle object literal syntax the parser would keep track of open and close braces.</p>
        </div>
      </SplitReverse>

      <SplitReverse>
        <Code lang="ts twoslash">{`
          const input: ({ name: string })  = { 
            name: "Zagreus"
          }
          
          console.log(input.name)`}
        </Code>
        <div>
          <p>For more complex to parse type syntax, the definition can be wrapped with parens to indicate the start and end point.</p>
        </div>
      </SplitReverse>


      <h2>Who benefits?</h2>
      <Split>
        
        <article>
          <h4>JavaScript Users</h4>
          <p>Greatly reduces the need for source code transformation in modern JavaScript projects.</p>
          <p>Cleaner and more powerful syntax than JSDoc comments.</p>
          <p>Allows users of existing static type systems to migrate back towards source code alignment with JavaScript.</p>
          <p>Copying and pasting just works.</p>
        </article>

        <article>
          <h4>Tool Makers</h4>
          <p>Different type systems can be built  to work in the ignored syntax area.</p>
          <p>Existing JavaScript tools can:</p>
          <ul>
            <li>Skip source-code changes</li>
            <li>Avoid duplicate transpiled files</li>
            <li>Lessen the need for source maps</li>
            <li>Simplify file resolvers</li>
            <li>Use one parsing strategy</li>
          </ul>
        </article>
      </Split>

      <h2>Frequently Asked Questions</h2>
      <aside>There is a comprehensive FAQ in the proposal itself, but these Q&amp;As I expect cover most JS users questions.</aside>

      <FAQ>
        <Entry title="I'm new, what are these terms?">
          <p>JavaScript is a language which does not provide a way to declare the input/outputs of your code. For example in JavaScript a let variable can be set to a string, number, object or more. </p>
          <p>JavaScript extensions like TypeScript and Flow exist to add new syntax which have a way to declare 'this let variable can only be a string.'</p>
          <p>The value in adding these extra definitions is that tooling can make better assumptions about how your code works and doesn't. That tooling can live in your IDE, or be a command-line app.</p>
          <p>The process of verifying these assumptions is called type checking, and for JavaScript there are different type checkers with different trade-offs about how JavaScript code can be validated.</p>
          <p>Prior to this proposal, you needed a tool like Babel or TypeScript to remove those definitions, after this proposal you do not need a build tool to remove them. </p>
          <p>Removing this step can help simplify working in JavaScript projects to the point where you may not need any build tooling at all.</p>
        </Entry>

        <Entry title="What type syntax is proposed?">
          <p>Type definitions on functions and variable declarations, import/exporting types, class field and methods, generics, function overloads, typecasting via as X, this parameters and more.</p>
        </Entry>

        <Entry title="Will JavaScript engines do type checking?">
          <p>No, the goal is to let projects like TypeScript, Flow and others provide the type system. JavaScript would have a defined set of areas for their syntax to live.</p>
        </Entry>

        <Entry title="Will this grow JavaScript bundle sizes?">
          <p>It could, but if you are already bundling then you would have the types removed during that bundling process. Negating the issue for most apps where bundle size is an concern.</p>
          <p>JavaScript files without a build-step would have more characters as a result of adding types syntax. This is the same trade-off as adding comments to the files.</p>
        </Entry>

        <Entry title="How does this differ from JSDoc support?">
          <p>Today JavaScript users use JSDoc syntax with TypeScript tooling from in order to create a type-system in JavaScript code without a build step. </p>
          <p>The syntax for JSDoc support is intentionally more verbose than type syntax, and is less ergonomic for complex typing. With this proposal, you can get JSDoc-like 'works without build tools' without the constraint of specially formatted comments.</p>
        </Entry>

        <Entry title="Does this proposal favour TypeScript?">
          <p>The proposal aims to allow TypeScript/Flow-like syntax inside JavaScript, and is strongly influenced by syntax which is common to both language extensions, and leaves the door open for new syntax extensions which haven’t been anticipated yet.</p>
          <p>In a way it favours TypeScript as it is the most popular type-system, but nearly all of the proposed syntax spaces would benefit Flow users too.</p>
        </Entry>

        <Entry title="How does this affect runtime error messaging?">
          <p>JavaScript today throws <code>SyntaxError</code> messages when it has evaluated invalid syntax. This will still be the same today, except for invalid code inside the areas designated for Types as Comments.</p>
          <Code lang="ts twoslash">{`// @noErrors
            const mes sage: string = "Hello, types"
            // @error: SyntaxError: Unexpected token ':'. const declared variable 'message' must have an initializer.
            `}
          </Code>
          <p>vs this 'error' in the types space:</p>
          <Code lang="ts">{`
            const message: { abc=123 } = "Hello, types"`}
          </Code>
          <p>Which would run perfectly fine in a JavaScript engine supporting this proposal, but fail in TypeScript or Flow. The proposal leaves type space errors to the IDE and type checker to declare the code inside the types are invalid, not the JavaScript runtime.</p>
        </Entry>

        <Entry title="Is there prior art?">
          <p>This proposal acts very similar to how Python implemented support for opt-in type checking. Ruby is quite similar too.</p>
        </Entry>
      </FAQ>

      <h2>Frequently Asked Questions</h2>
      <FAQ>
        <Entry title="Is this just TypeScript in JavaScript?">
          <p>No, not all of today’s TypeScript syntax would be supported by this proposal. This is similar to how Babel support for TypeScript does not support all of the existing TypeScript syntax. </p>
          <p>For example enums, namespaces and class parameter properties are unlikely to be supported.</p>
        </Entry>

        <Entry title="How could I convert my TypeScript codebase to Types as Comments JavaScript?">
          <p>It's likely that TypeScript will have a tsconfig flag which indicates that you want your files to be given the additional constraints  imposed by Types as Comments. </p>
          <p>This means you can migrate your code incrementally as .ts files before converting them to .js files.</p>
        </Entry>

        <Entry title="Do I _need_ to migrate?">
          <p>No, TypeScript has backwards compatability guarantees which means you can continue to use .ts and .tsx files for TypeScript.</p>
        </Entry>

        <Entry title="How does this differ from JSDoc support?">
          <p>I, orta, think it's probably worth migrating for long term software projects. Having your codebase aligned with JavaScript is an important de-risking strategy.</p>
          <p>TypeScript isn't going anywhere, but when you have the choice of 'this code runs in any JavaScript engine' vs 'I need to use build tooling to run this code' - I think the features you lose from TypeScript to support running un-aided in JavaScript are worth the trade-off.</p>
          <p>You're obviously allowed your own opinion.</p><s></s>
        </Entry>
      </FAQ>

      <h2>Links</h2>
      <aside>This page is a simpler overview of Types as Comments, to learn more about the proposal consult the GitHub repo.</aside>
      <Split>
        <a className="button" href="https://github.com/orta/types-as-comments-minisite.git">
          <h5>Motivations</h5>
          <p>How does this proposal improve the JavaScript ecosystem as a whole?</p>
        </a>

        <a className="button" href="https://github.com/orta/types-as-comments-minisite.git">
          <h5>Supported Syntax</h5>
          <p>From types definitions to class properties, see all the proposed supported type-level syntax.</p>
        </a>

        <a className="button" href="https://github.com/orta/types-as-comments-minisite.git">
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