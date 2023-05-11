# Typescript WebGL Carousel


## Credits
[Inspirational Site](https://alcre.co.kr) created by Eum Ray, using WebGL, react-three-fiber, and GSAP.

[Javascript source material](https://github.com/supahfunk/webgl-carousel) by [Fabio (supahfunk)](https://www.supah.it/portfolio/):

Fabio: [Twitter](https://twitter.com/supahfunk), [Instagram](https://www.instagram.com/supahfunk/), [Codepen](https://codepen.io/supah), [LinkedIn](https://www.linkedin.com/in/fabio-ottaviani-82b0776/) 

![Image Title](https://tympanus.net/codrops/wp-content/uploads/2023/04/webglcarousel.jpg)

[Article on Codrops](https://tympanus.net/codrops/?p=71727)

[Javascript Demo](http://tympanus.net/Development/WebGLCarousel/)

## License
[MIT](LICENSE)

## Getting Started
This is a [Next.js](https://nextjs.org/) project.
First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Setup GLSL
I prefer to use glsl as files imports.

VS Code extension (optional): [Shader languages support for VS Code](https://marketplace.visualstudio.com/items?itemName=slevesque.shader)

next.config.js (npm install raw-loader)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|frag)$/,
      exclude: '/node_modules',
      use: ['raw-loader'],
    })
    return config
  },
}

module.exports = nextConfig
```

Type declaration
```javascript
declare module '*.glsl' {
  const value: string;
  export default value;
}
```

import example:
```javascript
import vertex from '@/three/shaders/vertex.glsl'
import fragment from '@/three/shaders/fragment.glsl'
```

## Changes to source javascript
Besides adding types:
- Renamed many variables to name more suited for personal style
 

