import{c as F,d as O,a as v,I as Re,J as Ge,U as te,A as _,G as Be,j as Ue,g,_ as p,K as Ae,L as Ie,N as Fe,E as c,S as Oe,O as re,Q as C,V as Ee,W as K,X as ze,F as y,Y as ae,q as x,v as D,w as ne,Z as Y,$ as De,t as J,s as R,x as L,y as M,a0 as U,i as Le,a1 as A,a2 as He,z as We,e as Ve,C as I,a3 as ie,a4 as je,a5 as Ne,a6 as qe,a7 as se,h as oe,o as X,p as G,a8 as Ke,P as Ye,B as Je,R as ue,D as le,a9 as Xe,aa as Qe}from"./index-e9a6487e.js";import{B as Ze,d as $e}from"./colorToUniform-e74e556a.js";var et=`in vec2 vMaskCoord;
in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform sampler2D uMaskTexture;

uniform float uAlpha;
uniform vec4 uMaskClamp;

out vec4 finalColor;

void main(void)
{
    float clip = step(3.5,
        step(uMaskClamp.x, vMaskCoord.x) +
        step(uMaskClamp.y, vMaskCoord.y) +
        step(vMaskCoord.x, uMaskClamp.z) +
        step(vMaskCoord.y, uMaskClamp.w));

    // TODO look into why this is needed
    float npmAlpha = uAlpha; 
    vec4 original = texture(uTexture, vTextureCoord);
    vec4 masky = texture(uMaskTexture, vMaskCoord);
    float alphaMul = 1.0 - npmAlpha * (1.0 - masky.a);

    original *= (alphaMul * masky.r * uAlpha * clip);

    finalColor = original;
}
`,tt=`in vec2 aPosition;

out vec2 vTextureCoord;
out vec2 vMaskCoord;


uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;
uniform mat3 uFilterMatrix;

vec4 filterVertexPosition(  vec2 aPosition )
{
    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
       
    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

vec2 filterTextureCoord(  vec2 aPosition )
{
    return aPosition * (uOutputFrame.zw * uInputSize.zw);
}

vec2 getFilterCoord( vec2 aPosition )
{
    return  ( uFilterMatrix * vec3( filterTextureCoord(aPosition), 1.0)  ).xy;
}   

void main(void)
{
    gl_Position = filterVertexPosition(aPosition);
    vTextureCoord = filterTextureCoord(aPosition);
    vMaskCoord = getFilterCoord(aPosition);
}
`,Q=`struct GlobalFilterUniforms {
  uInputSize:vec4<f32>,
  uInputPixel:vec4<f32>,
  uInputClamp:vec4<f32>,
  uOutputFrame:vec4<f32>,
  uGlobalFrame:vec4<f32>,
  uOutputTexture:vec4<f32>,  
};

struct MaskUniforms {
  uFilterMatrix:mat3x3<f32>,
  uMaskClamp:vec4<f32>,
  uAlpha:f32,
};


@group(0) @binding(0) var<uniform> gfu: GlobalFilterUniforms;
@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler : sampler;

@group(1) @binding(0) var<uniform> filterUniforms : MaskUniforms;
@group(1) @binding(1) var uMaskTexture: texture_2d<f32>;

struct VSOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv : vec2<f32>,
    @location(1) filterUv : vec2<f32>,
  };

fn filterVertexPosition(aPosition:vec2<f32>) -> vec4<f32>
{
    var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;

    position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

fn filterTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
    return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);
}

fn globalTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
  return  (aPosition.xy / gfu.uGlobalFrame.zw) + (gfu.uGlobalFrame.xy / gfu.uGlobalFrame.zw);  
}

fn getFilterCoord(aPosition:vec2<f32> ) -> vec2<f32>
{
  return ( filterUniforms.uFilterMatrix * vec3( filterTextureCoord(aPosition), 1.0)  ).xy;
}

fn getSize() -> vec2<f32>
{

  
  return gfu.uGlobalFrame.zw;
}
  
@vertex
fn mainVertex(
  @location(0) aPosition : vec2<f32>, 
) -> VSOutput {
  return VSOutput(
   filterVertexPosition(aPosition),
   filterTextureCoord(aPosition),
   getFilterCoord(aPosition)
  );
}

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
  @location(1) filterUv: vec2<f32>,
  @builtin(position) position: vec4<f32>
) -> @location(0) vec4<f32> {

    var maskClamp = filterUniforms.uMaskClamp;

     var clip = step(3.5,
        step(maskClamp.x, filterUv.x) +
        step(maskClamp.y, filterUv.y) +
        step(filterUv.x, maskClamp.z) +
        step(filterUv.y, maskClamp.w));

    var mask = textureSample(uMaskTexture, uSampler, filterUv);
    var source = textureSample(uTexture, uSampler, uv);
    
    var npmAlpha = 0.0;

    var alphaMul = 1.0 - npmAlpha * (1.0 - mask.a);

    var a = (alphaMul * mask.r) * clip;

    return vec4(source.rgb, source.a) * a;
}`,rt=["sprite"],at=function(a){F(e,a);var t=O(e);function e(r){var n;v(this,e);var i=r.sprite,s=Re(r,rt),o=new Ge(i.texture),u=new te({uFilterMatrix:{value:new _,type:"mat3x3<f32>"},uMaskClamp:{value:o.uClampFrame,type:"vec4<f32>"},uAlpha:{value:1,type:"f32"}}),d=Be.from({vertex:{source:Q,entryPoint:"mainVertex"},fragment:{source:Q,entryPoint:"mainFragment"}}),l=Ue.from({vertex:tt,fragment:et,name:"mask-filter"});return n=t.call(this,g(g({},s),{},{gpuProgram:d,glProgram:l,resources:{filterUniforms:u,uMaskTexture:i.texture.source}})),n.sprite=i,n._textureMatrix=o,n}return p(e,[{key:"apply",value:function(n,i,s,o){this._textureMatrix.texture=this.sprite.texture,n.calculateSpriteMatrix(this.resources.filterUniforms.uniforms.uFilterMatrix,this.sprite).prepend(this._textureMatrix.mapCoord),this.resources.uMaskTexture=this.sprite.texture.source,n.applyFilter(this,i,s,o)}}]),e}(Ae),de=function(){function a(t,e){v(this,a),this.state=Oe.for2d(),this._batches=Object.create(null),this._geometries=Object.create(null),this.renderer=t,this._adaptor=e,this._adaptor.init(this)}return p(a,[{key:"buildStart",value:function(e){if(!this._batches[e.uid]){var r=new Ie;this._batches[e.uid]=r,this._geometries[r.uid]=new Fe}this._activeBatch=this._batches[e.uid],this._activeGeometry=this._geometries[this._activeBatch.uid],this._activeBatch.begin()}},{key:"addToBatch",value:function(e){this._activeBatch.add(e)}},{key:"break",value:function(e){this._activeBatch.break(e)}},{key:"buildEnd",value:function(e){var r=this._activeBatch,n=this._activeGeometry;r.finish(e),n.indexBuffer.setDataWithSize(r.indexBuffer,r.indexSize,!0),n.buffers[0].setDataWithSize(r.attributeBuffer.float32View,r.attributeSize,!1)}},{key:"upload",value:function(e){var r=this._batches[e.uid],n=this._geometries[r.uid];r.dirty&&(r.dirty=!1,n.buffers[0].update(r.attributeSize*4))}},{key:"execute",value:function(e){if(e.action==="startBatch"){var r=e.batcher,n=this._geometries[r.uid];this._adaptor.start(this,n)}this._adaptor.execute(this,e)}},{key:"destroy",value:function(){this.state=null,this.renderer=null,this._adaptor.destroy(),this._adaptor=null;for(var e in this._batches)this._batches[e].destroy();this._batches=null;for(var r in this._geometries)this._geometries[r].destroy();this._geometries=null}}]),a}();de.extension={type:[c.WebGLPipes,c.WebGPUPipes,c.CanvasPipes],name:"batch"};var wt={name:"texture-bit",vertex:{header:`

        struct TextureUniforms {
            uTextureMatrix:mat3x3<f32>,
        }

        @group(2) @binding(2) var<uniform> textureUniforms : TextureUniforms;
        `,main:`
            uv = (textureUniforms.uTextureMatrix * vec3(uv, 1.0)).xy;
        `},fragment:{header:`
            @group(2) @binding(0) var uTexture: texture_2d<f32>;
            @group(2) @binding(1) var uSampler: sampler;

         
        `,main:`
            outColor = textureSample(uTexture, uSampler, vUV);
        `}},Pt={name:"texture-bit",vertex:{header:`
            uniform mat3 uTextureMatrix;
        `,main:`
            uv = (uTextureMatrix * vec3(uv, 1.0)).xy;
        `},fragment:{header:`
        uniform sampler2D uTexture;

         
        `,main:`
            outColor = texture(uTexture, vUV);
        `}};function nt(a,t){var e=a.root,r=a.instructionSet;r.reset(),t.batch.buildStart(r),t.blendMode.buildStart(),t.colorMask.buildStart(),e.sortableChildren&&e.sortChildren(),ce(e,r,t,!0),t.batch.buildEnd(r),t.blendMode.buildEnd(r)}function E(a,t,e){a.globalDisplayStatus<7||!a.includeInBuild||(a.sortableChildren&&a.sortChildren(),a.isSimple?it(a,t,e):ce(a,t,e,!1))}function it(a,t,e){if(a.renderPipeId){e.blendMode.setBlendMode(a,a.groupBlendMode,t),a.didViewUpdate=!1;var r=e;r[a.renderPipeId].addRenderable(a,t)}if(!a.isRenderGroupRoot)for(var n=a.children,i=n.length,s=0;s<i;s++)E(n[s],t,e)}function ce(a,t,e,r){if(!r&&a.isRenderGroupRoot)e.renderGroup.addRenderGroup(a.renderGroup,t);else{for(var n=0;n<a.effects.length;n++){var i=a.effects[n],s=e[i.pipe];s.push(i,a,t)}var o=a.renderPipeId;if(o){e.blendMode.setBlendMode(a,a.groupBlendMode,t),a.didViewUpdate=!1;var u=e[o];u.addRenderable(a,t)}var d=a.children;if(d.length)for(var l=0;l<d.length;l++)E(d[l],t,e);for(var f=a.effects.length-1;f>=0;f--){var h=a.effects[f],m=e[h.pipe];m.pop(h,a,t)}}}var st=new re,ot=function(a){F(e,a);var t=O(e);function e(){return v(this,e),t.call(this,{filters:[new at({sprite:new ze(y.EMPTY)})]})}return p(e,[{key:"sprite",get:function(){return this.filters[0].sprite},set:function(n){this.filters[0].sprite=n}}]),e}(ae),fe=function(){function a(t){v(this,a),this._activeMaskStage=[],this._renderer=t}return p(a,[{key:"push",value:function(e,r,n){var i=this._renderer;if(i.renderPipes.batch.break(n),n.add({renderPipeId:"alphaMask",action:"pushMaskBegin",mask:e,canBundle:!1,maskedContainer:r}),e.renderMaskToTexture){var s=e.mask;s.includeInBuild=!0,E(s,n,i.renderPipes),s.includeInBuild=!1}i.renderPipes.batch.break(n),n.add({renderPipeId:"alphaMask",action:"pushMaskEnd",mask:e,maskedContainer:r,canBundle:!1})}},{key:"pop",value:function(e,r,n){var i=this._renderer;i.renderPipes.batch.break(n),n.add({renderPipeId:"alphaMask",action:"popMaskEnd",mask:e,canBundle:!1})}},{key:"execute",value:function(e){var r=this._renderer,n=e.mask.renderMaskToTexture;if(e.action==="pushMaskBegin"){var i=C.get(ot);if(n){e.mask.mask.measurable=!0;var s=Ee(e.mask.mask,!0,st);e.mask.mask.measurable=!1,s.ceil();var o=K.getOptimalTexture(s.width,s.height,1,!1);r.renderTarget.push(o,!0),r.globalUniforms.push({offset:s,worldColor:4294967295});var u=i.sprite;u.texture=o,u.worldTransform.tx=s.minX,u.worldTransform.ty=s.minY,this._activeMaskStage.push({filterEffect:i,maskedContainer:e.maskedContainer,filterTexture:o})}else i.sprite=e.mask.mask,this._activeMaskStage.push({filterEffect:i,maskedContainer:e.maskedContainer})}else if(e.action==="pushMaskEnd"){var d=this._activeMaskStage[this._activeMaskStage.length-1];n&&(r.renderTarget.pop(),r.globalUniforms.pop()),r.filter.push({renderPipeId:"filter",action:"pushFilter",container:d.maskedContainer,filterEffect:d.filterEffect,canBundle:!1})}else if(e.action==="popMaskEnd"){r.filter.pop();var l=this._activeMaskStage.pop();n&&K.returnTexture(l.filterTexture),C.return(l.filterEffect)}}},{key:"destroy",value:function(){this._renderer=null,this._activeMaskStage=null}}]),a}();fe.extension={type:[c.WebGLPipes,c.WebGPUPipes,c.CanvasPipes],name:"alphaMask"};var he=function(){function a(t){v(this,a),this._colorStack=[],this._colorStackIndex=0,this._currentColor=0,this._renderer=t}return p(a,[{key:"buildStart",value:function(){this._colorStack[0]=15,this._colorStackIndex=1,this._currentColor=15}},{key:"push",value:function(e,r,n){var i=this._renderer;i.renderPipes.batch.break(n);var s=this._colorStack;s[this._colorStackIndex]=s[this._colorStackIndex-1]&e.mask;var o=this._colorStack[this._colorStackIndex];o!==this._currentColor&&(this._currentColor=o,n.add({renderPipeId:"colorMask",colorMask:o,canBundle:!1})),this._colorStackIndex++}},{key:"pop",value:function(e,r,n){var i=this._renderer;i.renderPipes.batch.break(n);var s=this._colorStack;this._colorStackIndex--;var o=s[this._colorStackIndex-1];o!==this._currentColor&&(this._currentColor=o,n.add({renderPipeId:"colorMask",colorMask:o,canBundle:!1}))}},{key:"execute",value:function(e){var r=this._renderer;r.colorMask.setMask(e.colorMask)}},{key:"destroy",value:function(){this._colorStack=null}}]),a}();he.extension={type:[c.WebGLPipes,c.WebGPUPipes,c.CanvasPipes],name:"colorMask"};var ve=function(){function a(t){v(this,a),this._maskStackHash={},this._maskHash=new WeakMap,this._renderer=t}return p(a,[{key:"push",value:function(e,r,n){var i,s,o=e,u=this._renderer;u.renderPipes.batch.break(n),u.renderPipes.blendMode.setBlendMode(o.mask,"none",n),n.add({renderPipeId:"stencilMask",action:"pushMaskBegin",mask:e,canBundle:!1});var d=o.mask;d.includeInBuild=!0,this._maskHash.has(o)||this._maskHash.set(o,{instructionsStart:0,instructionsLength:0});var l=this._maskHash.get(o);l.instructionsStart=n.instructionSize,E(d,n,u.renderPipes),d.includeInBuild=!1,u.renderPipes.batch.break(n),n.add({renderPipeId:"stencilMask",action:"pushMaskEnd",mask:e,canBundle:!1});var f=n.instructionSize-l.instructionsStart-1;l.instructionsLength=f;var h=u.renderTarget.renderTarget.uid;(i=(s=this._maskStackHash)[h])!==null&&i!==void 0||(s[h]=0)}},{key:"pop",value:function(e,r,n){var i=e,s=this._renderer;s.renderPipes.batch.break(n),s.renderPipes.blendMode.setBlendMode(i.mask,"none",n),n.add({renderPipeId:"stencilMask",action:"popMaskBegin",canBundle:!1});for(var o=this._maskHash.get(e),u=0;u<o.instructionsLength;u++)n.instructions[n.instructionSize++]=n.instructions[o.instructionsStart++];n.add({renderPipeId:"stencilMask",action:"popMaskEnd",canBundle:!1})}},{key:"execute",value:function(e){var r,n,i=this._renderer,s=i.renderTarget.renderTarget.uid,o=(r=(n=this._maskStackHash)[s])!==null&&r!==void 0?r:n[s]=0;e.action==="pushMaskBegin"?(i.renderTarget.ensureDepthStencil(),i.stencil.setStencilMode(x.RENDERING_MASK_ADD,o),o++,i.colorMask.setMask(0)):e.action==="pushMaskEnd"?(i.stencil.setStencilMode(x.MASK_ACTIVE,o),i.colorMask.setMask(15)):e.action==="popMaskBegin"?(i.colorMask.setMask(0),o!==0?i.stencil.setStencilMode(x.RENDERING_MASK_REMOVE,o):(i.renderTarget.clear(null,D.STENCIL),i.stencil.setStencilMode(x.DISABLED,o)),o--):e.action==="popMaskEnd"&&(i.stencil.setStencilMode(x.MASK_ACTIVE,o),i.colorMask.setMask(15)),this._maskStackHash[s]=o}},{key:"destroy",value:function(){this._renderer=null,this._maskStackHash=null,this._maskHash=null}}]),a}();ve.extension={type:[c.WebGLPipes,c.WebGPUPipes,c.CanvasPipes],name:"stencilMask"};function Rt(a,t){for(var e in a.attributes){var r=a.attributes[e],n=t[e];if(n){var i,s,o,u;(i=r.location)!==null&&i!==void 0||(r.location=n.location),(s=r.format)!==null&&s!==void 0||(r.format=n.format),(o=r.offset)!==null&&o!==void 0||(r.offset=n.offset),(u=r.instance)!==null&&u!==void 0||(r.instance=n.instance)}else ne("Attribute ".concat(e," is not present in the shader, but is present in the geometry. Unable to infer attribute details."))}ut(a)}function ut(a){var t=a.buffers,e=a.attributes,r={},n={};for(var i in t){var s=t[i];r[s.uid]=0,n[s.uid]=0}for(var o in e){var u=e[o];r[u.buffer.uid]+=Y(u.format).stride}for(var d in e){var l,f,h=e[d];(l=h.stride)!==null&&l!==void 0||(h.stride=r[h.buffer.uid]),(f=h.start)!==null&&f!==void 0||(h.start=n[h.buffer.uid]),n[h.buffer.uid]+=Y(h.format).stride}}var w=[];w[x.NONE]=void 0;w[x.DISABLED]={stencilWriteMask:0,stencilReadMask:0};w[x.RENDERING_MASK_ADD]={stencilFront:{compare:"equal",passOp:"increment-clamp"},stencilBack:{compare:"equal",passOp:"increment-clamp"}};w[x.RENDERING_MASK_REMOVE]={stencilFront:{compare:"equal",passOp:"decrement-clamp"},stencilBack:{compare:"equal",passOp:"decrement-clamp"}};w[x.MASK_ACTIVE]={stencilWriteMask:0,stencilFront:{compare:"equal",passOp:"keep"},stencilBack:{compare:"equal",passOp:"keep"}};var Gt=function(){function a(t){v(this,a),this._syncFunctionHash=Object.create(null),this._adaptor=t,this._systemCheck()}return p(a,[{key:"_systemCheck",value:function(){if(!De())throw new Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.")}},{key:"ensureUniformGroup",value:function(e){var r=this.getUniformGroupData(e);e.buffer||(e.buffer=new J({data:new Float32Array(r.layout.size/4),usage:R.UNIFORM|R.COPY_DST}))}},{key:"getUniformGroupData",value:function(e){return this._syncFunctionHash[e._signature]||this._initUniformGroup(e)}},{key:"_initUniformGroup",value:function(e){var r=e._signature,n=this._syncFunctionHash[r];if(!n){var i=Object.keys(e.uniformStructures).map(function(u){return e.uniformStructures[u]}),s=this._adaptor.createUboElements(i),o=this._generateUboSync(s.uboElements);n=this._syncFunctionHash[r]={layout:s,syncFunction:o}}return this._syncFunctionHash[r]}},{key:"_generateUboSync",value:function(e){return this._adaptor.generateUboSync(e)}},{key:"syncUniformGroup",value:function(e,r,n){var i=this.getUniformGroupData(e);return e.buffer||(e.buffer=new J({data:new Float32Array(i.layout.size/4),usage:R.UNIFORM|R.COPY_DST})),r||(r=e.buffer.data),n||(n=0),i.syncFunction(e.uniforms,r,n),!0}},{key:"updateUniformGroup",value:function(e){if(e.isStatic&&!e._dirtyId)return!1;e._dirtyId=0;var r=this.syncUniformGroup(e);return e.buffer.update(),r}},{key:"destroy",value:function(){this._syncFunctionHash=null}}]),a}(),B=[{type:"mat3x3<f32>",test:function(t){var e=t.value;return e.a!==void 0},ubo:`
            var matrix = uv[name].toArray(true);
            data[offset] = matrix[0];
            data[offset + 1] = matrix[1];
            data[offset + 2] = matrix[2];
            data[offset + 4] = matrix[3];
            data[offset + 5] = matrix[4];
            data[offset + 6] = matrix[5];
            data[offset + 8] = matrix[6];
            data[offset + 9] = matrix[7];
            data[offset + 10] = matrix[8];
        `,uniform:` 
            gl.uniformMatrix3fv(ud[name].location, false, uv[name].toArray(true));
        `},{type:"vec4<f32>",test:function(t){return t.type==="vec4<f32>"&&t.size===1&&t.value.width!==void 0},ubo:`
            v = uv[name];
            data[offset] = v.x;
            data[offset + 1] = v.y;
            data[offset + 2] = v.width;
            data[offset + 3] = v.height;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height) {
                cv[0] = v.x;
                cv[1] = v.y;
                cv[2] = v.width;
                cv[3] = v.height;
                gl.uniform4f(ud[name].location, v.x, v.y, v.width, v.height);
            }
        `},{type:"vec2<f32>",test:function(t){return t.type==="vec2<f32>"&&t.size===1&&t.value.x!==void 0},ubo:`
            v = uv[name];
            data[offset] = v.x;
            data[offset + 1] = v.y;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.x || cv[1] !== v.y) {
                cv[0] = v.x;
                cv[1] = v.y;
                gl.uniform2f(ud[name].location, v.x, v.y);
            }
        `},{type:"vec4<f32>",test:function(t){return t.type==="vec4<f32>"&&t.size===1&&t.value.red!==void 0},ubo:`
            v = uv[name];
            data[offset] = v.red;
            data[offset + 1] = v.green;
            data[offset + 2] = v.blue;
            data[offset + 3] = v.alpha;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue || cv[3] !== v.alpha) {
                cv[0] = v.red;
                cv[1] = v.green;
                cv[2] = v.blue;
                cv[3] = v.alpha;
                gl.uniform4f(ud[name].location, v.red, v.green, v.blue, v.alpha);
            }
        `},{type:"vec3<f32>",test:function(t){return t.type==="vec3<f32>"&&t.size===1&&t.value.red!==void 0},ubo:`
            v = uv[name];
            data[offset] = v.red;
            data[offset + 1] = v.green;
            data[offset + 2] = v.blue;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue) {
                cv[0] = v.red;
                cv[1] = v.green;
                cv[2] = v.blue;
                gl.uniform3f(ud[name].location, v.red, v.green, v.blue);
            }
        `}];function Bt(a,t,e,r){for(var n=[`
        var v = null;
        var v2 = null;
        var t = 0;
        var index = 0;
        var name = null;
        var arrayOffset = null;
    `],i=0,s=0;s<a.length;s++){for(var o=a[s],u=o.data.name,d=!1,l=0,f=0;f<B.length;f++){var h=B[f];if(h.test(o.data)){l=o.offset/4,n.push('name = "'.concat(u,'";'),"offset += ".concat(l-i,";"),B[f][t]||B[f].ubo),d=!0;break}}if(!d)if(o.data.size>1)l=o.offset/4,n.push(e(o,l-i));else{var m=r[o.data.type];l=o.offset/4,n.push(`
                    v = uv.`.concat(u,`;
                    offset += `).concat(l-i,`;
                    `).concat(m,`;
                `))}i=l}var k=n.join(`
`);return new Function("uv","data","offset",k)}function b(a,t){var e=a*t;return`
        for (let i = 0; i < `.concat(e,`; i++) {
            data[offset + (((i / `).concat(a,")|0) * 4) + (i % ").concat(a,`)] = v[i];
        }
    `)}var lt={f32:`
        data[offset] = v;`,i32:`
        data[offset] = v;`,"vec2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];`,"vec3<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];`,"vec4<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 3] = v[3];`,"mat2x2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 4] = v[2];
        data[offset + 5] = v[3];`,"mat3x3<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 4] = v[3];
        data[offset + 5] = v[4];
        data[offset + 6] = v[5];
        data[offset + 8] = v[6];
        data[offset + 9] = v[7];
        data[offset + 10] = v[8];`,"mat4x4<f32>":`
        for (let i = 0; i < 16; i++) {
            data[offset + i] = v[i];
        }`,"mat3x2<f32>":b(3,2),"mat4x2<f32>":b(4,2),"mat2x3<f32>":b(2,3),"mat4x3<f32>":b(4,3),"mat2x4<f32>":b(2,4),"mat3x4<f32>":b(3,4)},Ut=g(g({},lt),{},{"mat2x2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 3] = v[3];
    `});function dt(a,t,e,r,n,i){var s=i?1:-1;return a.identity(),a.a=1/r*2,a.d=s*(1/n*2),a.tx=-1-t*a.a,a.ty=-s-e*a.d,a}var T=new Map;function pe(a,t){if(!T.has(a)){var e=new y({source:new L(g({resource:a},t))}),r=function(){T.get(a)===e&&T.delete(a)};e.once("destroy",r),e.source.once("destroy",r),T.set(a,e)}return T.get(a)}function ct(a){var t=a.colorTexture.source.resource;return globalThis.HTMLCanvasElement&&t instanceof HTMLCanvasElement&&document.body.contains(t)}var me=function(){function a(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(v(this,a),this.uid=U("renderTarget"),this.colorTextures=[],this.dirtyId=0,this.isRoot=!1,this._size=new Float32Array(2),t=g(g({},a.defaultOptions),t),this.stencil=t.stencil,this.depth=t.depth,this.isRoot=t.isRoot,typeof t.colorTextures=="number")for(var e=0;e<t.colorTextures;e++)this.colorTextures.push(new M({width:t.width,height:t.height,resolution:t.resolution,antialias:t.antialias}));else{this.colorTextures=Le(t.colorTextures.map(function(n){return n.source}));var r=this.colorTexture.source;this.resize(r.width,r.height,r._resolution)}this.colorTexture.source.on("resize",this.onSourceResize,this),(t.depthStencilTexture||this.stencil)&&(t.depthStencilTexture instanceof y||t.depthStencilTexture instanceof M?this.depthStencilTexture=t.depthStencilTexture.source:this.ensureDepthStencilTexture())}return p(a,[{key:"size",get:function(){var e=this._size;return e[0]=this.pixelWidth,e[1]=this.pixelHeight,e}},{key:"width",get:function(){return this.colorTexture.source.width}},{key:"height",get:function(){return this.colorTexture.source.height}},{key:"pixelWidth",get:function(){return this.colorTexture.source.pixelWidth}},{key:"pixelHeight",get:function(){return this.colorTexture.source.pixelHeight}},{key:"resolution",get:function(){return this.colorTexture.source._resolution}},{key:"colorTexture",get:function(){return this.colorTextures[0]}},{key:"onSourceResize",value:function(e){this.resize(e.width,e.height,e._resolution,!0)}},{key:"ensureDepthStencilTexture",value:function(){this.depthStencilTexture||(this.depthStencilTexture=new M({width:this.width,height:this.height,resolution:this.resolution,format:"depth24plus-stencil8",autoGenerateMipmaps:!1,antialias:!1,mipLevelCount:1}))}},{key:"resize",value:function(e,r){var n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:this.resolution,i=arguments.length>3&&arguments[3]!==void 0?arguments[3]:!1;this.dirtyId++,this.colorTextures.forEach(function(s,o){i&&o===0||s.source.resize(e,r,n)}),this.depthStencilTexture&&this.depthStencilTexture.source.resize(e,r,n)}},{key:"destroy",value:function(){this.colorTexture.source.off("resize",this.onSourceResize,this),this.depthStencilTexture&&(this.depthStencilTexture.destroy(),delete this.depthStencilTexture)}}]),a}();me.defaultOptions={width:0,height:0,resolution:1,colorTextures:1,stencil:!1,depth:!1,antialias:!1,isRoot:!1};var H=me,At=function(){function a(t){v(this,a),this.rootViewPort=new A,this.viewport=new A,this.onRenderTargetChange=new He("onRenderTargetChange"),this.projectionMatrix=new _,this.defaultClearColor=[0,0,0,0],this._renderSurfaceToRenderTargetHash=new Map,this._gpuRenderTargetHash=Object.create(null),this._renderTargetStack=[],this._renderer=t}return p(a,[{key:"finishRenderPass",value:function(){this.adaptor.finishRenderPass(this.renderTarget)}},{key:"renderStart",value:function(e){var r=e.target,n=e.clear,i=e.clearColor,s=e.frame;this._renderTargetStack.length=0,this.push(r,n,i,s),this.rootViewPort.copyFrom(this.viewport),this.rootRenderTarget=this.renderTarget,this.renderingToScreen=ct(this.rootRenderTarget)}},{key:"bind",value:function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0,n=arguments.length>2?arguments[2]:void 0,i=arguments.length>3?arguments[3]:void 0,s=this.getRenderTarget(e),o=this.renderTarget!==s;this.renderTarget=s,this.renderSurface=e;var u=this.getGpuRenderTarget(s);(s.pixelWidth!==u.width||s.pixelHeight!==u.height)&&(this.adaptor.resizeGpuRenderTarget(s),u.width=s.pixelWidth,u.height=s.pixelHeight);var d=s.colorTexture,l=this.viewport,f=d.pixelWidth,h=d.pixelHeight;if(!i&&e instanceof y&&(i=e.frame),i){var m=d._resolution;l.x=i.x*m+.5|0,l.y=i.y*m+.5|0,l.width=i.width*m+.5|0,l.height=i.height*m+.5|0}else l.x=0,l.y=0,l.width=f,l.height=h;return dt(this.projectionMatrix,0,0,l.width/d.resolution,l.height/d.resolution,!s.isRoot),this.adaptor.startRenderPass(s,r,n,l),o&&this.onRenderTargetChange.emit(s),s}},{key:"clear",value:function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:D.ALL,n=arguments.length>2?arguments[2]:void 0;r&&(e&&(e=this.getRenderTarget(e)),this.adaptor.clear(e||this.renderTarget,r,n,this.viewport))}},{key:"contextChange",value:function(){this._gpuRenderTargetHash=Object.create(null)}},{key:"push",value:function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:D.ALL,n=arguments.length>2?arguments[2]:void 0,i=arguments.length>3?arguments[3]:void 0,s=this.bind(e,r,n,i);return this._renderTargetStack.push({renderTarget:s,frame:i}),s}},{key:"pop",value:function(){this._renderTargetStack.pop();var e=this._renderTargetStack[this._renderTargetStack.length-1];this.bind(e.renderTarget,!1,null,e.frame)}},{key:"getRenderTarget",value:function(e){var r;return e.isTexture&&(e=e.source),(r=this._renderSurfaceToRenderTargetHash.get(e))!==null&&r!==void 0?r:this._initRenderTarget(e)}},{key:"copyToTexture",value:function(e,r,n,i,s){n.x<0&&(i.width+=n.x,s.x-=n.x,n.x=0),n.y<0&&(i.height+=n.y,s.y-=n.y,n.y=0);var o=e.pixelWidth,u=e.pixelHeight;return i.width=Math.min(i.width,o-n.x),i.height=Math.min(i.height,u-n.y),this.adaptor.copyToTexture(e,r,n,i,s)}},{key:"ensureDepthStencil",value:function(){this.renderTarget.stencil||(this.renderTarget.stencil=!0,this.adaptor.startRenderPass(this.renderTarget,!1,null,this.viewport))}},{key:"destroy",value:function(){this._renderer=null,this._renderSurfaceToRenderTargetHash.forEach(function(e,r){e!==r&&e.destroy()}),this._renderSurfaceToRenderTargetHash.clear(),this._gpuRenderTargetHash=Object.create(null)}},{key:"_initRenderTarget",value:function(e){var r=null;return L.test(e)&&(e=pe(e)),e instanceof H?r=e:e instanceof M&&(r=new H({colorTextures:[e]}),L.test(e.source.resource)&&(r.isRoot=!0),e.on("destroy",function(){r.destroy()})),this._renderSurfaceToRenderTargetHash.set(e,r),r}},{key:"getGpuRenderTarget",value:function(e){return this._gpuRenderTargetHash[e.uid]||(this._gpuRenderTargetHash[e.uid]=this.adaptor.initGpuRenderTarget(e))}}]),a}(),It=function(a){F(e,a);var t=O(e);function e(r){var n,i=r.buffer,s=r.offset,o=r.size;return v(this,e),n=t.call(this),n.uid=U("buffer"),n._resourceType="bufferResource",n._touched=0,n._resourceId=U("resource"),n._bufferResource=!0,n.destroyed=!1,n.buffer=i,n.offset=s|0,n.size=o,n.buffer.on("change",n.onBufferChange,We(n)),n}return p(e,[{key:"onBufferChange",value:function(){this._resourceId=U("resource"),this.emit("change",this)}},{key:"destroy",value:function(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:!1;this.destroyed=!0,n&&this.buffer.destroy(),this.emit("change",this),this.buffer=null}}]),e}(Ve),ge=function(){function a(t){v(this,a),this._renderer=t}return p(a,[{key:"addRenderable",value:function(e,r){this._renderer.renderPipes.batch.break(r),r.add(e)}},{key:"execute",value:function(e){e.isRenderable&&e.render(this._renderer)}},{key:"destroy",value:function(){this._renderer=null}}]),a}();ge.extension={type:[c.WebGLPipes,c.WebGPUPipes,c.CanvasPipes],name:"customRender"};function xe(a,t){for(var e=a.instructionSet,r=e.instructions,n=0;n<e.instructionSize;n++){var i=r[n];t[i.renderPipeId].execute(i)}}var ye=function(){function a(t){v(this,a),this._renderer=t}return p(a,[{key:"addRenderGroup",value:function(e,r){this._renderer.renderPipes.batch.break(r),r.add(e)}},{key:"execute",value:function(e){e.isRenderable&&(this._renderer.globalUniforms.push({worldTransformMatrix:e.worldTransform,worldColor:e.worldColorAlpha}),xe(e,this._renderer.renderPipes),this._renderer.globalUniforms.pop())}},{key:"destroy",value:function(){this._renderer=null}}]),a}();ye.extension={type:[c.WebGLPipes,c.WebGPUPipes,c.CanvasPipes],name:"renderGroup"};function ke(a){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:[];t.push(a);for(var e=0;e<a.renderGroupChildren.length;e++)ke(a.renderGroupChildren[e],t);return t}var ft=new I;function _e(a){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;ht(a);var e=a.childrenToUpdate,r=a.updateTick;a.updateTick++;for(var n in e){for(var i=e[n],s=i.list,o=i.index,u=0;u<o;u++)be(s[u],r,0);i.index=0}if(t)for(var d=0;d<a.renderGroupChildren.length;d++)_e(a.renderGroupChildren[d],t)}function ht(a){var t=a.root,e;if(a.renderGroupParent){var r=a.renderGroupParent;a.worldTransform.appendFrom(t.relativeGroupTransform,r.worldTransform),a.worldColor=ie(t.groupColor,r.worldColor),e=t.groupAlpha*r.worldAlpha}else a.worldTransform.copyFrom(t.localTransform),a.worldColor=t.localColor,e=t.localAlpha;e=e<0?0:e>1?1:e,a.worldAlpha=e,a.worldColorAlpha=a.worldColor+((e*255|0)<<24)}function be(a,t,e){if(t!==a.updateTick){a.updateTick=t,a.didChange=!1;var r=a.localTransform;a.updateLocalTransform();var n=a.parent;if(n&&!n.isRenderGroupRoot?(e=e|a._updateFlags,a.relativeGroupTransform.appendFrom(r,n.relativeGroupTransform),e&&Z(a,n,e)):(e=a._updateFlags,a.relativeGroupTransform.copyFrom(r),e&&Z(a,ft,e)),!a.isRenderGroupRoot){for(var i=a.children,s=i.length,o=0;o<s;o++)be(i[o],t,e);var u=a.renderGroup;a.renderPipeId&&!u.structureDidChange&&u.updateRenderable(a)}}}function Z(a,t,e){if(e&je){a.groupColor=ie(a.localColor,t.groupColor);var r=a.localAlpha*t.groupAlpha;r=r<0?0:r>1?1:r,a.groupAlpha=r,a.groupColorAlpha=a.groupColor+((r*255|0)<<24)}e&Ne&&(a.groupBlendMode=a.localBlendMode==="inherit"?t.groupBlendMode:a.localBlendMode),e&qe&&(a.globalDisplayStatus=a.localDisplayStatus&t.globalDisplayStatus),a._updateFlags=0}function vt(a,t){for(var e=a.childrenRenderablesToUpdate,r=e.list,n=e.index,i=!1,s=0;s<n;s++){var o=r[s],u=o,d=t[u.renderPipeId];if(i=d.validateRenderable(o),i)break}return a.structureDidChange=i,i}var pt=new _,Te=function(){function a(t){v(this,a),this._renderer=t}return p(a,[{key:"render",value:function(e){var r=e.container,n=e.transform;r.isRenderGroup=!0;var i=r.parent,s=r.renderGroup.renderGroupParent;r.parent=null,r.renderGroup.renderGroupParent=null;var o=this._renderer,u=ke(r.renderGroup,[]),d=pt;n&&(d=d.copyFrom(r.renderGroup.localTransform),r.renderGroup.localTransform.copyFrom(n));for(var l=o.renderPipes,f=0;f<u.length;f++){var h=u[f];h.runOnRender(),h.instructionSet.renderPipes=l,h.structureDidChange||vt(h,l),_e(h),h.structureDidChange?(h.structureDidChange=!1,nt(h,l)):mt(h),h.childrenRenderablesToUpdate.index=0,o.renderPipes.batch.upload(h.instructionSet)}o.globalUniforms.start({worldTransformMatrix:n?r.renderGroup.localTransform:r.renderGroup.worldTransform,worldColor:r.renderGroup.worldColorAlpha}),xe(r.renderGroup,l),l.uniformBatch&&l.uniformBatch.renderEnd(),n&&r.renderGroup.localTransform.copyFrom(d),r.parent=i,r.renderGroup.renderGroupParent=s}},{key:"destroy",value:function(){this._renderer=null}}]),a}();Te.extension={type:[c.WebGLSystem,c.WebGPUSystem,c.CanvasSystem],name:"renderGroup"};function mt(a){for(var t=a.childrenRenderablesToUpdate,e=t.list,r=t.index,n=0;n<r;n++){var i=e[n];i.didViewUpdate&&a.updateRenderable(i)}}var Ce=function(){function a(t){v(this,a),this._gpuSpriteHash=Object.create(null),this._renderer=t}return p(a,[{key:"addRenderable",value:function(e,r){var n=this._getGpuSprite(e);e._didSpriteUpdate&&this._updateBatchableSprite(e,n),this._renderer.renderPipes.batch.addToBatch(n)}},{key:"updateRenderable",value:function(e){var r=this._gpuSpriteHash[e.uid];e._didSpriteUpdate&&this._updateBatchableSprite(e,r),r.batcher.updateElement(r)}},{key:"validateRenderable",value:function(e){var r=e._texture,n=this._getGpuSprite(e);return n.texture._source!==r._source?!n.batcher.checkAndUpdateTexture(n,r):!1}},{key:"destroyRenderable",value:function(e){var r=this._gpuSpriteHash[e.uid];C.return(r),this._gpuSpriteHash[e.uid]=null}},{key:"_updateBatchableSprite",value:function(e,r){e._didSpriteUpdate=!1,r.bounds=e.bounds,r.texture=e._texture}},{key:"_getGpuSprite",value:function(e){return this._gpuSpriteHash[e.uid]||this._initGPUSprite(e)}},{key:"_initGPUSprite",value:function(e){var r=this,n=C.get(Ze);return n.renderable=e,n.texture=e._texture,n.bounds=e.bounds,n.roundPixels=this._renderer._roundPixels|e._roundPixels,this._gpuSpriteHash[e.uid]=n,e._didSpriteUpdate=!1,e.on("destroyed",function(){r.destroyRenderable(e)}),n}},{key:"destroy",value:function(){for(var e in this._gpuSpriteHash)C.return(this._gpuSpriteHash[e]);this._gpuSpriteHash=null,this._renderer=null}}]),a}();Ce.extension={type:[c.WebGLPipes,c.WebGPUPipes,c.CanvasPipes],name:"sprite"};var W=function(){function a(){v(this,a),this.clearBeforeRender=!0,this._backgroundColor=new se(0),this.color=this._backgroundColor,this.alpha=1}return p(a,[{key:"init",value:function(e){e=g(g({},a.defaultOptions),e),this.clearBeforeRender=e.clearBeforeRender,this.color=e.background||e.backgroundColor||this._backgroundColor,this.alpha=e.backgroundAlpha,this._backgroundColor.setAlpha(e.backgroundAlpha)}},{key:"color",get:function(){return this._backgroundColor},set:function(e){this._backgroundColor.setValue(e)}},{key:"alpha",get:function(){return this._backgroundColor.alpha},set:function(e){this._backgroundColor.setAlpha(e)}},{key:"colorRgba",get:function(){return this._backgroundColor.toArray()}},{key:"destroy",value:function(){}}]),a}();W.extension={type:[c.WebGLSystem,c.WebGPUSystem,c.CanvasSystem],name:"background",priority:0};W.defaultOptions={backgroundAlpha:1,backgroundColor:0,clearBeforeRender:!0};var gt=W,S={};oe.handle(c.BlendMode,function(a){if(!a.name)throw new Error("BlendMode extension must have a name property");S[a.name]=a.ref},function(a){delete S[a.name]});var Me=function(){function a(t){v(this,a),this._isAdvanced=!1,this._filterHash=Object.create(null),this._renderer=t}return p(a,[{key:"setBlendMode",value:function(e,r,n){if(this._activeBlendMode===r){this._isAdvanced&&this._renderableList.push(e);return}this._activeBlendMode=r,this._isAdvanced&&this._endAdvancedBlendMode(n),this._isAdvanced=!!S[r],this._isAdvanced&&(this._beginAdvancedBlendMode(n),this._renderableList.push(e))}},{key:"_beginAdvancedBlendMode",value:function(e){this._renderer.renderPipes.batch.break(e);var r=this._activeBlendMode;if(!S[r]){ne("Unable to assign BlendMode: '".concat(r,"'. You may want to include: import 'pixi.js/advanced-blend-modes'"));return}this._filterHash[r]||(this._filterHash[r]=new ae({filters:[new S[r]]}));var n={renderPipeId:"filter",action:"pushFilter",renderables:[],filterEffect:this._filterHash[r],canBundle:!1};this._renderableList=n.renderables,e.add(n)}},{key:"_endAdvancedBlendMode",value:function(e){this._renderableList=null,this._renderer.renderPipes.batch.break(e),e.add({renderPipeId:"filter",action:"popFilter",canBundle:!1})}},{key:"buildStart",value:function(){this._isAdvanced=!1}},{key:"buildEnd",value:function(e){this._isAdvanced&&this._endAdvancedBlendMode(e)}},{key:"destroy",value:function(){this._renderer=null,this._renderableList=null;for(var e in this._filterHash)this._filterHash[e].destroy();this._filterHash=null}}]),a}();Me.extension={type:[c.WebGLPipes,c.WebGPUPipes,c.CanvasPipes],name:"blendMode"};var z={png:"image/png",jpg:"image/jpeg",webp:"image/webp"},V=function(){function a(t){v(this,a),this._renderer=t}return p(a,[{key:"_normalizeOptions",value:function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};return e instanceof I||e instanceof y?g({target:e},r):g(g({},r),e)}},{key:"image",value:function(){var t=X(G().mark(function r(n){var i;return G().wrap(function(o){for(;;)switch(o.prev=o.next){case 0:return i=new Image,o.next=3,this.base64(n);case 3:return i.src=o.sent,o.abrupt("return",i);case 5:case"end":return o.stop()}},r,this)}));function e(r){return t.apply(this,arguments)}return e}()},{key:"base64",value:function(){var t=X(G().mark(function r(n){var i,s,o,u,d;return G().wrap(function(f){for(;;)switch(f.prev=f.next){case 0:if(n=this._normalizeOptions(n,a.defaultImageOptions),i=n,s=i.format,o=i.quality,u=this.canvas(n),u.toBlob===void 0){f.next=5;break}return f.abrupt("return",new Promise(function(h,m){u.toBlob(function(k){if(!k){m(new Error("ICanvas.toBlob failed!"));return}var P=new FileReader;P.onload=function(){return h(P.result)},P.onerror=m,P.readAsDataURL(k)},z[s],o)}));case 5:if(u.toDataURL===void 0){f.next=7;break}return f.abrupt("return",u.toDataURL(z[s],o));case 7:if(u.convertToBlob===void 0){f.next=12;break}return f.next=10,u.convertToBlob({type:z[s],quality:o});case 10:return d=f.sent,f.abrupt("return",new Promise(function(h,m){var k=new FileReader;k.onload=function(){return h(k.result)},k.onerror=m,k.readAsDataURL(d)}));case 12:throw new Error("Extract.base64() requires ICanvas.toDataURL, ICanvas.toBlob, or ICanvas.convertToBlob to be implemented");case 13:case"end":return f.stop()}},r,this)}));function e(r){return t.apply(this,arguments)}return e}()},{key:"canvas",value:function(e){e=this._normalizeOptions(e);var r=e.target,n=this._renderer;if(r instanceof y)return n.texture.generateCanvas(r);var i=n.textureGenerator.generateTexture(e),s=n.texture.generateCanvas(i);return i.destroy(),s}},{key:"pixels",value:function(e){e=this._normalizeOptions(e);var r=e.target,n=this._renderer,i=r instanceof y?r:n.textureGenerator.generateTexture(e),s=n.texture.getPixels(i);return r instanceof I&&i.destroy(),s}},{key:"texture",value:function(e){return e=this._normalizeOptions(e),e.target instanceof y?e.target:this._renderer.textureGenerator.generateTexture(e)}},{key:"download",value:function(e){var r;e=this._normalizeOptions(e);var n=this.canvas(e),i=document.createElement("a");i.download=(r=e.filename)!==null&&r!==void 0?r:"image.png",i.href=n.toDataURL("image/png"),document.body.appendChild(i),i.click(),document.body.removeChild(i)}},{key:"log",value:function(e){var r,n=(r=e.width)!==null&&r!==void 0?r:200;e=this._normalizeOptions(e);var i=this.canvas(e),s=i.toDataURL();console.log("[Pixi Texture] ".concat(i.width,"px ").concat(i.height,"px"));var o=["font-size: 1px;","padding: ".concat(n,"px ",300,"px;"),"background: url(".concat(s,") no-repeat;"),"background-size: contain;"].join(" ");console.log("%c ",o)}},{key:"destroy",value:function(){this._renderer=null}}]),a}();V.extension={type:[c.WebGLSystem,c.WebGPUSystem],name:"extract"};V.defaultImageOptions={format:"png",quality:1};var xt=V,yt=function(a){F(e,a);var t=O(e);function e(){return v(this,e),t.apply(this,arguments)}return p(e,[{key:"resize",value:function(n,i,s){return this.source.resize(n,i,s),this}}],[{key:"create",value:function(n){return new y({source:new M(n)})}}]),e}(y),kt=new A,_t=new re,bt=[0,0,0,0],Se=function(){function a(t){v(this,a),this._renderer=t}return p(a,[{key:"generateTexture",value:function(e){var r;e instanceof I&&(e={target:e,frame:void 0,textureSourceOptions:{},resolution:void 0});var n=e.resolution||this._renderer.resolution,i=e.antialias||this._renderer.view.antialias,s=e.target,o=e.clearColor;if(o){var u=Array.isArray(o)&&o.length===4;o=u?o:se.shared.setValue(o).toArray()}else o=bt;var d=((r=e.frame)===null||r===void 0?void 0:r.copyTo(kt))||Ke(s,_t).rectangle;d.width=Math.max(d.width,1/n)|0,d.height=Math.max(d.height,1/n)|0;var l=yt.create(g(g({},e.textureSourceOptions),{},{width:d.width,height:d.height,resolution:n,antialias:i})),f=_.shared.translate(-d.x,-d.y);return this._renderer.render({container:s,transform:f,target:l,clearColor:o}),l}},{key:"destroy",value:function(){this._renderer=null}}]),a}();Se.extension={type:[c.WebGLSystem,c.WebGPUSystem],name:"textureGenerator"};var we=function(){function a(t){v(this,a),this._stackIndex=0,this._globalUniformDataStack=[],this._uniformsPool=[],this._activeUniforms=[],this._bindGroupPool=[],this._activeBindGroups=[],this._renderer=t}return p(a,[{key:"reset",value:function(){this._stackIndex=0;for(var e=0;e<this._activeUniforms.length;e++)this._uniformsPool.push(this._activeUniforms[e]);for(var r=0;r<this._activeBindGroups.length;r++)this._bindGroupPool.push(this._activeBindGroups[r]);this._activeUniforms.length=0,this._activeBindGroups.length=0}},{key:"start",value:function(e){this.reset(),this.push(e)}},{key:"bind",value:function(e){var r=e.size,n=e.projectionMatrix,i=e.worldTransformMatrix,s=e.worldColor,o=e.offset,u=this._renderer.renderTarget.renderTarget,d=this._stackIndex?this._globalUniformDataStack[this._stackIndex-1]:{projectionData:u,worldTransformMatrix:new _,worldColor:4294967295,offset:new Ye},l={projectionMatrix:n||this._renderer.renderTarget.projectionMatrix,resolution:r||u.size,worldTransformMatrix:i||d.worldTransformMatrix,worldColor:s||d.worldColor,offset:o||d.offset,bindGroup:null},f=this._uniformsPool.pop()||this._createUniforms();this._activeUniforms.push(f);var h=f.uniforms;h.uProjectionMatrix=l.projectionMatrix,h.uResolution=l.resolution,h.uWorldTransformMatrix.copyFrom(l.worldTransformMatrix),h.uWorldTransformMatrix.tx-=l.offset.x,h.uWorldTransformMatrix.ty-=l.offset.y,$e(l.worldColor,h.uWorldColorAlpha,0),f.update();var m;this._renderer.renderPipes.uniformBatch?m=this._renderer.renderPipes.uniformBatch.getUniformBindGroup(f,!1):(m=this._bindGroupPool.pop()||new Je,this._activeBindGroups.push(m),m.setResource(f,0)),l.bindGroup=m,this._currentGlobalUniformData=l}},{key:"push",value:function(e){this.bind(e),this._globalUniformDataStack[this._stackIndex++]=this._currentGlobalUniformData}},{key:"pop",value:function(){this._currentGlobalUniformData=this._globalUniformDataStack[--this._stackIndex-1],this._renderer.type===ue.WEBGL&&this._currentGlobalUniformData.bindGroup.resources[0].update()}},{key:"bindGroup",get:function(){return this._currentGlobalUniformData.bindGroup}},{key:"uniformGroup",get:function(){return this._currentGlobalUniformData.bindGroup.resources[0]}},{key:"_createUniforms",value:function(){var e=new te({uProjectionMatrix:{value:new _,type:"mat3x3<f32>"},uWorldTransformMatrix:{value:new _,type:"mat3x3<f32>"},uWorldColorAlpha:{value:new Float32Array(4),type:"vec4<f32>"},uResolution:{value:[0,0],type:"vec2<f32>"}},{isStatic:!0});return e}},{key:"destroy",value:function(){this._renderer=null}}]),a}();we.extension={type:[c.WebGLSystem,c.WebGPUSystem,c.CanvasSystem],name:"globalUniforms"};var $=!1,ee="8.1.0";function Tt(a){if(!$){if(le.get().getNavigator().userAgent.toLowerCase().indexOf("chrome")>-1){var t,e=["%c  %c  %c  %c  %c PixiJS %c v".concat(ee," (").concat(a,`) http://www.pixijs.com/

`),"background: #E72264; padding:5px 0;","background: #6CA2EA; padding:5px 0;","background: #B5D33D; padding:5px 0;","background: #FED23F; padding:5px 0;","color: #FFFFFF; background: #E72264; padding:5px 0;","color: #E72264; background: #FFFFFF; padding:5px 0;"];(t=globalThis.console).log.apply(t,e)}else globalThis.console&&globalThis.console.log("PixiJS ".concat(ee," - ").concat(a," - http://www.pixijs.com/"));$=!0}}var j=function(){function a(t){v(this,a),this._renderer=t}return p(a,[{key:"init",value:function(e){if(e.hello){var r=this._renderer.name;this._renderer.type===ue.WEBGL&&(r+=" ".concat(this._renderer.context.webGLVersion)),Tt(r)}}}]),a}();j.extension={type:[c.WebGLSystem,c.WebGPUSystem,c.CanvasSystem],name:"hello",priority:-2};j.defaultOptions={hello:!1};var N=function(){function a(t){v(this,a),this._renderer=t,this.count=0,this.checkCount=0}return p(a,[{key:"init",value:function(e){e=g(g({},a.defaultOptions),e),this.checkCountMax=e.textureGCCheckCountMax,this.maxIdle=e.textureGCAMaxIdle,this.active=e.textureGCActive}},{key:"postrender",value:function(){this._renderer.renderingToScreen&&(this.count++,this.active&&(this.checkCount++,this.checkCount>this.checkCountMax&&(this.checkCount=0,this.run())))}},{key:"run",value:function(){for(var e=this._renderer.texture.managedTextures,r=0;r<e.length;r++){var n=e[r];n.autoGarbageCollect&&n.resource&&n._touched>-1&&this.count-n._touched>this.maxIdle&&(n._touched=-1,n.unload())}}},{key:"destroy",value:function(){this._renderer=null}}]),a}();N.extension={type:[c.WebGLSystem,c.WebGPUSystem],name:"textureGC"};N.defaultOptions={textureGCActive:!0,textureGCAMaxIdle:60*60,textureGCCheckCountMax:600};var Pe=N;oe.add(Pe);var q=function(){function a(){v(this,a)}return p(a,[{key:"resolution",get:function(){return this.texture.source._resolution},set:function(e){this.texture.source.resize(this.texture.source.width,this.texture.source.height,e)}},{key:"init",value:function(e){e=g(g({},a.defaultOptions),e),e.view&&(Xe(Qe,"ViewSystem.view has been renamed to ViewSystem.canvas"),e.canvas=e.view),this.screen=new A(0,0,e.width,e.height),this.canvas=e.canvas||le.get().createCanvas(),this.antialias=!!e.antialias,this.texture=pe(this.canvas,e),this.renderTarget=new H({colorTextures:[this.texture],depth:!!e.depth,isRoot:!0}),this.texture.source.transparent=e.backgroundAlpha<1,this.multiView=!!e.multiView,this.autoDensity&&(this.canvas.style.width="".concat(this.texture.width,"px"),this.canvas.style.height="".concat(this.texture.height,"px")),this.resolution=e.resolution}},{key:"resize",value:function(e,r,n){this.texture.source.resize(e,r,n),this.screen.width=this.texture.frame.width,this.screen.height=this.texture.frame.height,this.autoDensity&&(this.canvas.style.width="".concat(e,"px"),this.canvas.style.height="".concat(r,"px"))}},{key:"destroy",value:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:!1,r=typeof e=="boolean"?e:!!(e!=null&&e.removeView);r&&this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas)}}]),a}();q.extension={type:[c.WebGLSystem,c.WebGPUSystem,c.CanvasSystem],name:"view",priority:0};q.defaultOptions={width:800,height:600,autoDensity:!1,antialias:!1};var Ct=q,Ft=[gt,we,j,Ct,Te,Pe,Se,xt],Ot=[Me,de,Ce,ye,fe,ve,he,ge];export{It as B,w as G,At as R,Ft as S,Gt as U,Ot as a,lt as b,Bt as c,B as d,Rt as e,Pt as f,wt as t,Ut as u};
