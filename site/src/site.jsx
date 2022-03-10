// @ts-check
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { writeFileSync } from "fs"
import { DevWebSocket, Entry, FAQ, Header, setupShikiTwoslash, Split, Code, TwoThirdsHeading, CenterOneColumn } from "./components.jsx"

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
            const message: string = "Hello, types"
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

      <p>The Types as Comments proposal aims to simplify working in a modern JavaScript codebases. With Types as Comments, developers can remove a build step from their apps, keeping TypeScript and Flow codebases aligned with JavaScript. This proposal does not precisely specify a type syntax, which provides innovative space for different type systems.</p>

      <h2>How the proposal works</h2>
      <aside>Note: this is a simplification of the overall Types as Comments proposal.</aside>

      <Split>
        <Code lang="ts twoslash">{`
          const message = "Hello, types"

          /* Echo the message */
          console.log(message)
          // @log: Hello, types`}
        </Code>
        <div>
          <p>Today, a JavaScript engine knows that a slash and a star (<code>/*</code>) indicates the start of a multi-line comment.</p>
          <p>To the engine, this roughly means: <em>"from this point in the code, keep reading characters and ignore them until you find a star with a slash right after <code>*/</code>"</em>.</p>
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
          <p>For the simplest case, the same idea could be applied to an engine which implements Type as Comments.</p>
          <p>If the engine has just seen an variable like <code>message</code> and the next character is a colon (<code>:</code>), then treat the colon (<code>:</code>) and certain pieces of code after ('<code>: string</code>') as a comment.</p>
          <p>In this case, once an engine would hit the <code>=</code> charater, it would stop interpreting the code as comments and read the initializer of <code>message</code>.</p>
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
          <p>The underlying implementation would need to be a bit more complex than that. For example, to handle things like object type literals (<code>{`{ id: string }`}</code>) an engine would keep track of open and close braces.</p>
          <p>The goal of the proposal is to provide a way to describe how to safely ignore type-like code inside the JavaScript language.</p>
        </div>
      </CenterOneColumn>

      <h2>Who benefits?</h2>
      <Split>
        
        <article>
          <h4>JavaScript and TypeScript Users</h4>
          <p>Less need for source code transformation in modern JavaScript projects.</p>
          <p>Cleaner and more powerful syntax than JSDoc comments.</p>
          <p>Pasting typed code into consoles and REPLs just works.</p>
        </article>

        <article>
          <h4>Tool Makers</h4>
          <p>New experimental type systems can be built using the ignored syntax space.</p>
          <p>Existing JavaScript tools can:</p>
          <ul>
            <li>Skip source-code changes</li>
            <li>Reduce the need for sourcemaps</li>
            <li>Simplify file resolvers</li>
            <li>Use one parsing strategy</li>
          </ul>
        </article>

        <article>
          <h4>Engine Maintainers</h4>
          <p>Browser engines do not pay any type-checking cost at runtime.</p>
          <p>Engine maintainers avoid the burden of parser upgrades as each type system evolves.</p>
        </article>
      </Split>

      <h2>Frequently Asked Questions</h2>
      <aside>There is a comprehensive FAQ in the proposal itself, but these Q&amp;As I expect cover most JS users questions.</aside>

      <FAQ>
        <Entry title="What type syntax is proposed?">
          <p>Type definitions on functions and variable declarations, import/exporting types, class field and methods, generics, type assertions, <code>this</code> parameters, and more.</p>
        </Entry>

        <Entry title="Will JavaScript engines perform type-checking?">
          <p>No, the goal is to let projects like TypeScript, Flow, and others provide the type system and check the code for type errors. JavaScript would only reserve a space in the JavaScript syntax for their type syntax to exist.</p>
        </Entry>

        <Entry title="Will adding types slow down my JavaScript programs?">
          <p>Like any new JavaScript feature, it would have performance trade-offs, and there is some amount of parsing that would be required; however the performance here should be relatively small as these types just act as comments.</p>
          <p>In short, no.</p>
        </Entry>

        <Entry title="Will this grow JavaScript bundle sizes?">
          <p>It could, but if you are currently bundling and using type syntax, types are already being removed during that bundling process. Most existing tools could continue to strip away types, or delegate the task to optimizers/minifiers..</p>
          <p>JavaScript files without a build-step would have more characters as a result of the types. This is the same trade-off as adding comments to files, and the same solutions apply (e.g. use a minifier).</p>
        </Entry>

        <Entry title="How does this differ from JSDoc support?">
          <p>Today JavaScript users can write JSDoc comments and have them checked by TypeScript or Closure Compiler.</p>
          <p>The syntax for JSDoc support is more verbose than type syntax, and is less ergonomic for complex typing. With this proposal, you can get the JSDoc-like "works without build tools" experience without the constraints of JSDoc comments.</p>
        </Entry>

        <Entry title="Does this proposal favor TypeScript?">
          <p>The proposal favors TypeScript/Flow-like syntax inside JavaScript, and is strongly influenced by syntax which is common to both language extensions. The aim is to also leave the door open for new syntax extensions which haven't been anticipated yet.</p>
          <p>That said, the language in this specification favours TypeScript as it is the most popular type-system, but nearly all of the proposed syntax spaces would benefit Flow users too.</p>
        </Entry>

        <Entry title="Is there prior art?">
          <p>Python similarly implements support for opt-in type-checking. However this proposal has a stronger stance of relying solely on type erasure. Ruby is quite similar too.</p>
        </Entry>  

        <Entry title="Will this slow down JavaScript's evolution?">
          <p>JavaScript's backwards compatibility goals of never breaking old code means that this is something future JavaScript syntax improvements would need to take into account. It is unlikely to get in the way of most new syntax however, as it is a strictly specified gap in the language instead of code which runs.</p>
        </Entry>  

        <Entry title="How does this affect runtime error messaging?">
          <p>At most, the only new errors that an engine could issue are <code>SyntaxError</code>s. In some cases, the Types as Comments leaves a lot of room for invalid-<em>looking</em> syntax, but which is actually fine.</p>
          <p>For example, this syntax would be expected to error in TypeScript or Flow, but would be accepted by a JavaScript engine.:</p>
          <Code lang="ts">{`
            const message: { abc=123 } = "Hello, types"`}
          </Code>
          <p>On the other hand, the Types as Comments proposal does have some expectations around type syntax, and ill-formatted types at the top level of an annotation might have issues.</p>
          <Code lang="js twoslash">{`
            const message: !!@@hello@@!! = "Hello, types"
            // @error: SyntaxError
            // @noErrors`}
          </Code>
          <p>While there would be some restrictions on type syntax, the proposal leaves type space errors to the IDE and type checker to report when certain types are invalid.</p>
        </Entry>

         <Entry title="I'm new, what are these terms?">
          <p>JavaScript is a language which does not provide a way to declare the input/outputs of your code. For example, in JavaScript a variable can be set to a string, a number, an object, and more.</p>
          <p>JavaScript extensions like TypeScript and Flow exist to add new syntax which have a way to state that "this variable should only ever hold a string."</p>
          <p>The value in adding this syntax is that tooling can make better assumptions about how your code works, and let you know when something might go wrong. That tooling can live in your editor, or be a command-line app.</p>
          <p>The process of verifying these assumptions is called type checking, and for JavaScript there are different type checkers with different trade-offs about how JavaScript code can be validated.</p>
          <p>Prior to this proposal, you needed a tool like Babel or TypeScript to remove these types, but if this proposal is accepted, you won't need a build tool to remove them.</p>
          <p>Removing this step can help simplify working in JavaScript projects to the point where you may not need any build tooling at all.</p>
        </Entry>

        <Entry title="What does the grammar look like?">
          <p>You can read the <a href="https://giltayar.github.io/proposal-types-as-comments/grammar.html">grammar spec here</a> and <a href="https://github.com/giltayar/proposal-types-as-comments/blob/master/syntax/grammar-ideas.md">notes for implementation</a> inside the repo.</p>
        </Entry>
      </FAQ>

      <h2>Frequently Asked Questions about TypeScript</h2>
      <aside>Note: There is also <a href= "https://devblogs.microsoft.com/typescript/a-proposal-for-type-syntax-in-javascript/">a TypeScript Blog Post</a> on the topic.</aside>
      <FAQ>
        <Entry title="Will all of TypeScript be supported by this proposal?">
          <p>No, not all of today's TypeScript syntax would be supported by this proposal. This is similar to how Babel support for TypeScript does not support all of the existing TypeScript syntax. </p>
          <p>For example enums, namespaces and class parameter properties are unlikely to be supported. In addition, specifying type arguments at function call-sites will require a slightly different syntax.</p>
        </Entry>

        <Entry title="How would I convert my TypeScript codebase to JavaScript with Types as Comments?">
          <p>It's possible that TypeScript would introduce an option to ensure that your code is compatible with Types as Comments.</p>
          <p>Teams could incrementally migrate by addressing each reported error as necessary. When no new errors are reported, <code>.ts</code> file extensions could be replaced with <code>.js</code> and the migration would be done.</p>
        </Entry>

        <Entry title="How does this differ from JSDoc support?">
          <p>JSDoc solves the same problem as this proposal by putting the type information inside existing comments! Given the constraint of not being able to change the JavaScript language, this was the best compromise to introduce type-checking in plain JavaScript.</p>
          <p>This proposal removes that constraint and changes the JavaScript language to permit syntax that can be used for types. This proposal allows you to have the cake ("It's just JavaScript") and eat it too ("I want to check the types"). You get all the benefits of TypeScript's JSDoc support, but without the awkward syntax.</p>
        </Entry>

        <Entry title="Do I need to migrate?">
          <p>No. TypeScript has backwards compatibility guarantees which means that you can continue to use `.ts` and `.tsx` files for TypeScript. Your code that works today will continue to work tomorrow.</p>
          <p>In fact, given how new this proposal is, we strongly advise not to rewrite existing code as it would be premature.</p>
        </Entry>
      </FAQ>

      <h2>Links</h2>
      <aside>This page is a simpler overview of Types as Comments, to learn more about the proposal consult the GitHub repo.</aside>
      <Split>
        <a className="button" href="https://github.com/giltayar/proposal-types-as-comments#motivation">
          <h5>Motivations</h5>
          <p>How does this proposal improve the JavaScript ecosystem as a whole?</p>
        </a>

        <a className="button" href="https://github.com/giltayar/proposal-types-as-comments#proposal">
          <h5>Supported Syntax</h5>
          <p>From types definitions to class properties, see all the proposed supported type-level syntax.</p>
        </a>

        <a className="button" href="https://github.com/giltayar/proposal-types-as-comments#FAQ">
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
