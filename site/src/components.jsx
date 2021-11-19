// @ts-check
import React from "react"
import {setupForFile, transformAttributesToHTML} from "remark-shiki-twoslash"

/** @param {{ title: string, subtitle: string }} props  */
export const Header = (props) => {
    return <div id='site-header'>
        <div id="logo">
            <TC39Logo />
        </div>
        <div>
            <h1>{props.title}</h1>
            <p>{props.subtitle}</p>
        </div>
    </div>
}

export const TC39Logo = () => (
  <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 0H0V50H50V0Z" fill="#FC7C00"/>
    <path d="M24.8278 36.4738H26.623C27.3823 36.4738 27.9442 36.2749 28.3087 35.877C28.6733 35.4791 28.8558 34.9262 28.8563 34.2182C28.8563 33.5759 28.6738 33.0614 28.3087 32.6746C27.9436 32.2878 27.4145 32.0944 26.7214 32.0944C26.123 32.0944 25.6204 32.2696 25.2135 32.6198C24.8066 32.9701 24.6021 33.4299 24.6 33.9992H21.5048L21.4825 33.9333C21.4386 32.6852 21.9167 31.6561 22.9167 30.846C23.9167 30.036 25.1574 29.631 26.6389 29.631C28.2881 29.631 29.6037 30.0251 30.5857 30.8135C31.5677 31.6018 32.0584 32.7259 32.0579 34.1857C32.0579 34.8794 31.8389 35.5381 31.4008 36.1619C30.9418 36.8035 30.3176 37.3087 29.5944 37.6238C30.4775 37.9376 31.1508 38.4193 31.6143 39.069C32.0778 39.7188 32.3095 40.4743 32.3095 41.3357C32.3095 42.7955 31.7786 43.9434 30.7167 44.7794C29.6548 45.6153 28.2942 46.0328 26.6349 46.0317C25.1534 46.0317 23.8815 45.6394 22.819 44.8548C21.7566 44.0701 21.2439 42.9624 21.281 41.5317L21.3032 41.4659H24.3984C24.391 41.75 24.4461 42.0322 24.5596 42.2928C24.6731 42.5533 24.8424 42.7858 25.0556 42.9738C25.4947 43.3722 26.0503 43.5714 26.7222 43.5714C27.4593 43.5714 28.0413 43.3675 28.4682 42.9595C28.8952 42.5516 29.1087 41.9981 29.1087 41.2992C29.1087 40.4616 28.8989 39.8481 28.4794 39.4587C28.0598 39.0693 27.4413 38.8746 26.6238 38.8746H24.8278V36.4738Z" fill="black"/>
    <path d="M25.223 15.1048H20.873V12.3468H32.7119V15.1048H28.3619V27.5937H25.223V15.1048Z" fill="black"/>
    <path d="M31.927 19.9707C31.927 15.4635 35.4024 12.1675 39.7746 12.1675C42.5325 12.1675 44.5055 13.154 45.8738 15.2841L43.4746 16.9881C42.7603 15.8222 41.5238 14.9929 39.7746 14.9929C37.0167 14.9929 35.1555 17.123 35.1555 19.9707C35.1555 22.8183 37.0167 24.9929 39.7746 24.9929C41.7476 24.9929 42.8468 24.0508 43.6984 22.7508L46.142 24.4326C44.819 26.4961 42.7111 27.7961 39.7738 27.7961C35.4032 27.7953 31.927 24.477 31.927 19.9707Z" fill="black"/>
    <path d="M39.3389 43.5714C40.178 43.5714 40.8624 43.2606 41.3921 42.6389C41.9217 42.0172 42.1862 41.1275 42.1857 39.9698V39.1817C41.8468 39.6204 41.4101 39.9737 40.9103 40.2135C40.4115 40.4456 39.8668 40.5625 39.3167 40.5556C37.8352 40.5556 36.669 40.072 35.8182 39.1048C34.9675 38.1376 34.5423 36.8291 34.5428 35.1794C34.5428 33.5884 35.0455 32.2656 36.0508 31.2111C37.0561 30.1566 38.337 29.6294 39.8936 29.6294C41.5212 29.6294 42.8423 30.1897 43.8571 31.3103C44.8719 32.431 45.3794 34.0058 45.3794 36.0349V39.8016C45.3794 41.736 44.8119 43.2579 43.677 44.3675C42.5421 45.477 41.095 46.0325 39.3357 46.0341C38.7604 46.0319 38.1866 45.9748 37.6222 45.8635C37.0599 45.7575 36.5111 45.5895 35.9857 45.3627L36.3579 43.0444C36.8134 43.2207 37.2846 43.3535 37.7651 43.4413C38.2848 43.5314 38.8114 43.575 39.3389 43.5714ZM39.8532 38.2175C40.3297 38.2283 40.8022 38.1272 41.2325 37.9222C41.6088 37.74 41.9355 37.4696 42.1849 37.1341V35.6635C42.1849 34.4958 41.9804 33.609 41.5714 33.0032C41.1624 32.3974 40.6069 32.0944 39.9048 32.0944C39.2624 32.0944 38.7386 32.3937 38.3333 32.9921C37.928 33.5905 37.7254 34.3204 37.7254 35.1817C37.7254 36.087 37.9106 36.8188 38.2809 37.377C38.6513 37.9352 39.1754 38.2143 39.8532 38.2143V38.2175Z" fill="black"/>
  </svg>
)

/** @param {{ children: any }} props  */
export const Split = (props) => (
    <div className='section split'>{props.children}</div>
)

/** @param {{ children: any }} props  */
export const SplitReverse = (props) => (
    <div className='section split reverse'>{props.children}</div>
)

/** @param {{ name: string, body: string }} props  */
export const TwoThirdsHeading = (props) => (
    <div className="section two-thirds">
       <div className="one"><h4>{props.name}</h4></div>
       <p className="two">{props.body}</p>
   </div>  
)

/** @param {{ children: any }} props  */
export const CenterOneColumn = (props) => (
    <div className="section  one-column-center">
        {props.children}
   </div>  
)

// Twoslash is a code markup language, described at https://shikijs.github.io/twoslash/
// It re-uses the vscode tooling for rendering code samples, and then uses the TypeScript
// compiler APIs to make richer code samples.

let twoslash

/** @param {import("shiki-twoslash").UserConfigSettings} config  */
export const setupShikiTwoslash = async (config) => {
    twoslash = await setupForFile(config)
}

/** @param {{ lang: string, title?: string, emoji?: string, emojiName?: string, children: any }} props  */
export const Code = (props) => {
    if (typeof props.children !== "string") throw new Error("Code components need to be strings, not more components.")

    const Prefix = props.title ? () => <h4 className="code-title">{props.title}</h4> : () => null
    const Suffix = props.emoji ? () => <span className="emoji" role="img" aria-label={props.emojiName}>{props.emoji}</span> : () => null
    const code =  dedentString(props.children)

    const html = transformAttributesToHTML(code, props.lang, twoslash.highlighters, twoslash.settings)
    return <div className="code-sample">
        <Prefix />
        <div dangerouslySetInnerHTML={{ __html: html }}></div>
        <Suffix />
    </div>
}

/** @param {{ children: any }} props  */
export const FAQ = (props) => {
    return <div className="section  faq">{props.children}</div>
}

/** @param {{ title:string, children: any }} props  */
export const Entry = (props) => {
    return <div>
        <div className="question">{props.title}</div>
        {props.children}
    </div>
}

/** A websocket connection to the dev server which triggers a reload */
export const DevWebSocket = () => {
    if (!process.env.SITE_DEV) {
        return null
    }

    const js = `    
// Listen for messages telling us to reload
const socket = new WebSocket('ws://localhost:8080');
socket.addEventListener('message', function (event) {
    document.location.reload()
});`

    return <script dangerouslySetInnerHTML={{ __html: js}} />
}

function dedentString(code) {
    // Based on dedent-js, which is MIT licensed
    // at https://github.com/MartinKolarik/dedent-js/blob/master/LICENSE
    const lines = [code]
    let matches = [];

	for (let i = 0; i < lines.length; i++) {
		let match;
		if (match = lines[i].match(/\n[\t ]+/g)) {
			matches.push(...match);
		}
	}

    
    if (matches.length) {
		let size = Math.min(...matches.map(value => value.length - 1));
		let pattern = new RegExp(`\n[\t ]{${size}}`, 'g');

		for (let i = 0; i < lines.length; i++) {
			lines[i] = lines[i].replace(pattern, '\n');
		}
	}
    lines[0] = lines[0].replace(/^\r?\n/, '');
    return lines.join("\n")
}