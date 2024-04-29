import{w as W,i as z,G as E,j as L,g as s,_ as O,a as $}from"./index-e9a6487e.js";function G(e,r,n){if(e)for(var t in e){var o=t.toLocaleLowerCase(),a=r[o];if(a){var u=e[t];t==="header"&&(u=u.replace(/@in\s+[^;]+;\s*/g,"").replace(/@out\s+[^;]+;\s*/g,"")),n&&a.push("//----".concat(n,"----//")),a.push(u)}else W("".concat(t," placement hook does not exist in shader"))}}var F=/\{\{(.*?)\}\}/g;function A(e){var r,n,t={},o=(r=(n=e.match(F))===null||n===void 0?void 0:n.map(function(a){return a.replace(/[{()}]/g,"")}))!==null&&r!==void 0?r:[];return o.forEach(function(a){t[a]=[]}),t}function R(e,r){for(var n,t=/@in\s+([^;]+);/g;(n=t.exec(e))!==null;)r.push(n[1])}function B(e,r){var n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!1,t=[];R(r,t),e.forEach(function(c){c.header&&R(c.header,t)});var o=t;n&&o.sort();var a=o.map(function(c,i){return"       @location(".concat(i,") ").concat(c,",")}).join(`
`),u=r.replace(/@in\s+[^;]+;\s*/g,"");return u=u.replace("{{in}}",`
`.concat(a,`
`)),u}function k(e,r){for(var n,t=/@out\s+([^;]+);/g;(n=t.exec(e))!==null;)r.push(n[1])}function N(e){var r=/\b(\w+)\s*:/g,n=r.exec(e);return n?n[1]:""}function X(e){var r=/@.*?\s+/g;return e.replace(r,"")}function Y(e,r){var n=[];k(r,n),e.forEach(function(i){i.header&&k(i.header,n)});var t=0,o=n.sort().map(function(i){return i.indexOf("builtin")>-1?i:"@location(".concat(t++,") ").concat(i)}).join(`,
`),a=n.sort().map(function(i){return"       var ".concat(X(i),";")}).join(`
`),u=`return VSOutput(
                `.concat(n.sort().map(function(i){return" ".concat(N(i))}).join(`,
`),");"),c=r.replace(/@out\s+[^;]+;\s*/g,"");return c=c.replace("{{struct}}",`
`.concat(o,`
`)),c=c.replace("{{start}}",`
`.concat(a,`
`)),c=c.replace("{{return}}",`
`.concat(u,`
`)),c}function _(e,r){var n=e;for(var t in r){var o=r[t],a=o.join(`
`);a.length?n=n.replace("{{".concat(t,"}}"),"//-----".concat(t,` START-----//
`).concat(o.join(`
`),`
//----`).concat(t," FINISH----//")):n=n.replace("{{".concat(t,"}}"),"")}return n}var v=Object.create(null),T=new Map,V=0;function q(e){var r=e.template,n=e.bits,t=D(r,n);if(v[t])return v[t];var o=J(r,n),a=o.vertex,u=o.fragment;return v[t]=H(a,u,n),v[t]}function w(e){var r=e.template,n=e.bits,t=D(r,n);return v[t]||(v[t]=H(r.vertex,r.fragment,n)),v[t]}function J(e,r){var n=r.map(function(u){return u.vertex}).filter(function(u){return!!u}),t=r.map(function(u){return u.fragment}).filter(function(u){return!!u}),o=B(n,e.vertex,!0);o=Y(n,o);var a=B(t,e.fragment,!0);return{vertex:o,fragment:a}}function D(e,r){return r.map(function(n){return T.has(n)||T.set(n,V++),T.get(n)}).sort(function(n,t){return n-t}).join("-")+e.vertex+e.fragment}function H(e,r,n){var t=A(e),o=A(r);return n.forEach(function(a){G(a.vertex,t,a.name),G(a.fragment,o,a.name)}),{vertex:_(e,t),fragment:_(r,o)}}var K=`
    @in aPosition: vec2<f32>;
    @in aUV: vec2<f32>;

    @out @builtin(position) vPosition: vec4<f32>;
    @out vUV : vec2<f32>;
    @out vColor : vec4<f32>;

    {{header}}

    struct VSOutput {
        {{struct}}
    };

    @vertex
    fn main( {{in}} ) -> VSOutput {

        var worldTransformMatrix = globalUniforms.uWorldTransformMatrix;
        var modelMatrix = mat3x3<f32>(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        var position = aPosition;
        var uv = aUV;

        {{start}}
        
        vColor = vec4<f32>(1., 1., 1., 1.);

        {{main}}

        vUV = uv;

        var modelViewProjectionMatrix = globalUniforms.uProjectionMatrix * worldTransformMatrix * modelMatrix;

        vPosition =  vec4<f32>((modelViewProjectionMatrix *  vec3<f32>(position, 1.0)).xy, 0.0, 1.0);
       
        vColor *= globalUniforms.uWorldColorAlpha;

        {{end}}

        {{return}}
    };
`,Q=`
    @in vUV : vec2<f32>;
    @in vColor : vec4<f32>;
   
    {{header}}

    @fragment
    fn main(
        {{in}}
      ) -> @location(0) vec4<f32> {
        
        {{start}}

        var outColor:vec4<f32>;
      
        {{main}}
        
        return outColor * vColor;
      };
`,Z=`
    in vec2 aPosition;
    in vec2 aUV;

    out vec4 vColor;
    out vec2 vUV;

    {{header}}

    void main(void){

        mat3 worldTransformMatrix = uWorldTransformMatrix;
        mat3 modelMatrix = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        vec2 position = aPosition;
        vec2 uv = aUV;
        
        {{start}}
        
        vColor = vec4(1.);
        
        {{main}}
        
        vUV = uv;
        
        mat3 modelViewProjectionMatrix = uProjectionMatrix * worldTransformMatrix * modelMatrix;

        gl_Position = vec4((modelViewProjectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);

        vColor *= uWorldColorAlpha;

        {{end}}
    }
`,nn=`
   
    in vec4 vColor;
    in vec2 vUV;

    out vec4 finalColor;

    {{header}}

    void main(void) {
        
        {{start}}

        vec4 outColor;
      
        {{main}}
        
        finalColor = outColor * vColor;
    }
`,rn={name:"global-uniforms-bit",vertex:{header:`
        struct GlobalUniforms {
            uProjectionMatrix:mat3x3<f32>,
            uWorldTransformMatrix:mat3x3<f32>,
            uWorldColorAlpha: vec4<f32>,
            uResolution: vec2<f32>,
        }

        @group(0) @binding(0) var<uniform> globalUniforms : GlobalUniforms;
        `}},tn={name:"global-uniforms-bit",vertex:{header:`
          uniform mat3 uProjectionMatrix;
          uniform mat3 uWorldTransformMatrix;
          uniform vec4 uWorldColorAlpha;
          uniform vec2 uResolution;
        `}};function cn(e){var r=e.bits,n=e.name,t=q({template:{fragment:Q,vertex:K},bits:[rn].concat(z(r))});return E.from({name:n,vertex:{source:t.vertex,entryPoint:"main"},fragment:{source:t.fragment,entryPoint:"main"}})}function ln(e){var r=e.bits,n=e.name;return new L(s({name:n},w({template:{vertex:Z,fragment:nn},bits:[tn].concat(z(r))})))}var vn={name:"color-bit",vertex:{header:`
            @in aColor: vec4<f32>;
        `,main:`
            vColor *= vec4<f32>(aColor.rgb * aColor.a, aColor.a);
        `}},sn={name:"color-bit",vertex:{header:`
            in vec4 aColor;
        `,main:`
            vColor *= vec4(aColor.rgb * aColor.a, aColor.a);
        `}},y={};function en(e){var r=[];if(e===1)r.push("@group(1) @binding(0) var textureSource1: texture_2d<f32>;"),r.push("@group(1) @binding(1) var textureSampler1: sampler;");else for(var n=0,t=0;t<e;t++)r.push("@group(1) @binding(".concat(n++,") var textureSource").concat(t+1,": texture_2d<f32>;")),r.push("@group(1) @binding(".concat(n++,") var textureSampler").concat(t+1,": sampler;"));return r.join(`
`)}function on(e){var r=[];if(e===1)r.push("outColor = textureSampleGrad(textureSource1, textureSampler1, vUV, uvDx, uvDy);");else{r.push("switch vTextureId {");for(var n=0;n<e;n++)n===e-1?r.push("  default:{"):r.push("  case ".concat(n,":{")),r.push("      outColor = textureSampleGrad(textureSource".concat(n+1,", textureSampler").concat(n+1,", vUV, uvDx, uvDy);")),r.push("      break;}");r.push("}")}return r.join(`
`)}function mn(e){return y[e]||(y[e]={name:"texture-batch-bit",vertex:{header:`
                @in aTextureIdAndRound: vec2<u32>;
                @out @interpolate(flat) vTextureId : u32;
            `,main:`
                vTextureId = aTextureIdAndRound.y;
            `,end:`
                if(aTextureIdAndRound.x == 1)
                {
                    vPosition = vec4<f32>(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
                }
            `},fragment:{header:`
                @in @interpolate(flat) vTextureId: u32;
    
                `.concat(en(16),`
            `),main:`
                var uvDx = dpdx(vUV);
                var uvDy = dpdy(vUV);
    
                `.concat(on(16),`
            `)}}),y[e]}var I={};function an(e){for(var r=[],n=0;n<e;n++)n>0&&r.push("else"),n<e-1&&r.push("if(vTextureId < ".concat(n,".5)")),r.push("{"),r.push("	outColor = texture(uTextures[".concat(n,"], vUV);")),r.push("}");return r.join(`
`)}function fn(e){return I[e]||(I[e]={name:"texture-batch-bit",vertex:{header:`
                in vec2 aTextureIdAndRound;
                out float vTextureId;
              
            `,main:`
                vTextureId = aTextureIdAndRound.y;
            `,end:`
                if(aTextureIdAndRound.x == 1.)
                {
                    gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
                }
            `},fragment:{header:`
                in float vTextureId;
    
                uniform sampler2D uTextures[`.concat(e,`];
              
            `),main:`
    
                `.concat(an(16),`
            `)}}),I[e]}var pn={name:"round-pixels-bit",vertex:{header:`
            fn roundPixels(position: vec2<f32>, targetSize: vec2<f32>) -> vec2<f32> 
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `}},dn={name:"round-pixels-bit",vertex:{header:`   
            vec2 roundPixels(vec2 position, vec2 targetSize)
            {       
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `}},j={name:"local-uniform-bit",vertex:{header:`

            struct LocalUniforms {
                uTransformMatrix:mat3x3<f32>,
                uColor:vec4<f32>,
                uRound:f32,
            }

            @group(1) @binding(0) var<uniform> localUniforms : LocalUniforms;
        `,main:`
            vColor *= localUniforms.uColor;
            modelMatrix *= localUniforms.uTransformMatrix;
        `,end:`
            if(localUniforms.uRound == 1)
            {
                vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
            }
        `}},hn=s(s({},j),{},{vertex:s(s({},j.vertex),{},{header:j.vertex.header.replace("group(1)","group(2)")})}),xn={name:"local-uniform-bit",vertex:{header:`

            uniform mat3 uTransformMatrix;
            uniform vec4 uColor;
            uniform float uRound;
        `,main:`
            vColor *= uColor;
            modelMatrix = uTransformMatrix;
        `,end:`
            if(uRound == 1.)
            {
                gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
            }
        `}},gn=function(){function e(){$(this,e),this.vertexSize=4,this.indexSize=6,this.location=0,this.batcher=null,this.batch=null,this.roundPixels=0}return O(e,[{key:"blendMode",get:function(){return this.renderable.groupBlendMode}},{key:"packAttributes",value:function(n,t,o,a){var u=this.renderable,c=this.texture,i=u.groupTransform,m=i.a,f=i.b,p=i.c,d=i.d,h=i.tx,x=i.ty,g=this.bounds,b=g.maxX,C=g.minX,S=g.maxY,P=g.minY,l=c.uvs,U=u.groupColorAlpha,M=a<<16|this.roundPixels&65535;n[o+0]=m*C+p*P+h,n[o+1]=d*P+f*C+x,n[o+2]=l.x0,n[o+3]=l.y0,t[o+4]=U,t[o+5]=M,n[o+6]=m*b+p*P+h,n[o+7]=d*P+f*b+x,n[o+8]=l.x1,n[o+9]=l.y1,t[o+10]=U,t[o+11]=M,n[o+12]=m*b+p*S+h,n[o+13]=d*S+f*b+x,n[o+14]=l.x2,n[o+15]=l.y2,t[o+16]=U,t[o+17]=M,n[o+18]=m*C+p*S+h,n[o+19]=d*S+f*C+x,n[o+20]=l.x3,n[o+21]=l.y3,t[o+22]=U,t[o+23]=M}},{key:"packIndex",value:function(n,t,o){n[t]=o+0,n[t+1]=o+1,n[t+2]=o+2,n[t+3]=o+0,n[t+4]=o+2,n[t+5]=o+3}},{key:"reset",value:function(){this.renderable=null,this.texture=null,this.batcher=null,this.batch=null,this.bounds=null}}]),e}();function bn(e,r,n){var t=(e>>24&255)/255;r[n++]=(e&255)/255*t,r[n++]=(e>>8&255)/255*t,r[n++]=(e>>16&255)/255*t,r[n++]=t}export{gn as B,vn as a,j as b,cn as c,bn as d,ln as e,sn as f,mn as g,fn as h,dn as i,xn as j,hn as l,pn as r};
