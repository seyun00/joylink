import React, { useEffect } from "react";
import "aframe";
import "aframe-particle-system-component";
import "aframe-extras"


export default function Vr() {
  const tent = "/tent.glb"
  const sakura ="/sakura.glb"
  
  const cherryBlossomImgPath = "/cherry_blossom.png";
  const grassImgPath ="/grass.jpg";
  
  const CountCherryBlossom = Array.from({length: 6}, () => 0); // 벚꽃나무 이미지 좌우 6세트 배열로 표현
  const CountGrass = Array.from({length: 9}, () => 0); // 풀밭 이미지 9세트 배열로 표현
  const tentline = Array.from({length: 13}, () => 0);
  return (
    <div>
      <h1>vr 페이지 입니다</h1>
      <a-scene className="aframe-scene">

        {/* 움직이는 속도 조절하기 -> acceleration 값 조절*/}
        <a-entity camera look-controls wasd-controls="acceleration: 60" position="0 1.6 0"></a-entity>

        {/* 하늘 */}
        <a-sky color="#9CCEFF"></a-sky>

        {/* 벚꽃나무 (왼쪽) */}
        {CountCherryBlossom.map((_, index)=>(
          <a-image src={cherryBlossomImgPath} 
          position={`-14 5.3 ${3-(index*9)}`} 
          width="9" 
          height="9"
          rotation="0 90 0">
          </a-image>
        ))}

        {/* 벚꽃나무 (오른쪽) */}
        {CountCherryBlossom.map((_, index)=>(
          <a-image src={cherryBlossomImgPath} 
          position={`14 5.3 ${3-(index*9)}`} 
          width="9" 
          height="9"
          rotation="0 -90 0">
          </a-image>
        ))}
        
        {/* 풀밭 이미지 */}
        {CountGrass.map((_, index)=>(
          <>
            <a-image src={grassImgPath} 
                    position={`0 1 ${4.5-(6*index)}`}
                    width="6" 
                    height="6"
                    rotation="90 90 0">
            </a-image>
            <a-image src={grassImgPath} 
                    position={`6 1 ${4.5-(6*index)}`}
                    width="6" 
                    height="6"
                    rotation="90 90 0">
            </a-image>
            <a-image src={grassImgPath} 
                    position={`-6 1 ${4.5-(6*index)}`} 
                    width="6" 
                    height="6"
                    rotation="90 90 0">
            </a-image>
          </>
        ))}
        {tentline.map((_, index)=>(
          <a-entity gltf-model={`url(${tent})`} 
          position={`-6 1 ${5-(index*4)}`}></a-entity>
        ))}
        {tentline.map((_, index)=>(
          <a-entity gltf-model={`url(${tent})`} 
          position={`6 1 ${5-(index*4)}`}></a-entity>
        ))}
        {CountCherryBlossom.map((_, index)=>(
          <a-entity gltf-model={`url(${sakura})`} 
          position={`-11 0.8 ${8-(index*8)}`}
          scale="0.5 0.5 0.5"
          rotation={`0 ${60*index}  0`}></a-entity>
        ))}
        {CountCherryBlossom.map((_, index)=>(
          <a-entity gltf-model={`url(${sakura})`} 
          position={`11 0.8 ${8-(index*8)}`}
          scale="0.5 0.5 0.5"
          rotation={`0 ${60*index}  0`}></a-entity>
        ))}
      </a-scene>
    </div>
  );
}
