import * as THREE from "three";
import { useMemo, forwardRef, useRef } from "react";

const CapsuleHalf = forwardRef(({ isTop, color }, ref) => {
  // 캡슐 지오메트리 캐싱
  const capsuleGeometry = useMemo(() => {
    return new THREE.CapsuleGeometry(1, 3, 20, 50);
  }, []);

  const clipPlane = useMemo(() => {
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, isTop ? 1 : -1), 0);

    const rotationMatrix = new THREE.Matrix4().makeRotationX(Math.PI / 2);
    plane.applyMatrix4(rotationMatrix);
    return plane;
  }, [isTop]);

  return (
    <>
      <mesh
        ref={ref}
        rotation={[Math.PI / 2, 0, 0]}
        geometry={capsuleGeometry}
        scale={[1, 1, 1]}
        material={
          new THREE.MeshStandardMaterial({
            color, //key와 value 값이 같으면 하나만 써도 됨 - 단축 속성명
            roughness: 0.1,
            metalness: 0.4,
            clippingPlanes: [clipPlane],
            side: THREE.DoubleSide,
          })
        }
      />
      <primitive object={new THREE.AxesHelper(2)} />
    </>
  );
});

export default CapsuleHalf;
