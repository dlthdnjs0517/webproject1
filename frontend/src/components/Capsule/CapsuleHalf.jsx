import * as THREE from "three";
import { useMemo, forwardRef, useRef } from "react";
import { useFrame } from "@react-three/fiber";

const CapsuleHalf = forwardRef(
  ({ isTop, color, axis = "z", followLocalPlane = true }, ref) => {
    // 캡슐 지오메트리 캐싱(길이축을 z+로 맞춤)
    const capsuleGeometry = useMemo(() => {
      const g = new THREE.CapsuleGeometry(1, 3, 20, 50);
      g.rotateX(Math.PI / 2);
      return g;
    }, []);

    const localPlane = useMemo(() => {
      const n =
        axis === "x"
          ? new THREE.Vector3(isTop ? 1 : -1, 0, 0)
          : axis === "y"
            ? new THREE.Vector3(0, isTop ? 1 : -1, 0)
            : new THREE.Vector3(0, 0, isTop ? 1 : -1); //default 값

      return new THREE.Plane(n, 0);
    }, [axis, isTop]);

    const worldPlane = useRef(new THREE.Plane());
    const Planes = useMemo(() => [worldPlane.current], []);

    const material = useMemo(() => {
      return new THREE.MeshStandardMaterial({
        color, //key와 value 값이 같으면 하나만 써도 됨 - 단축 속성명
        roughness: 0.1,
        metalness: 0.4,
        clippingPlanes: Planes,
        side: THREE.DoubleSide,
      });
    }, [color, Planes]);

    useFrame(() => {
      if (!ref.current) return;

      if (followLocalPlane) {
        worldPlane.current
          .copy(localPlane)
          .applyMatrix4(ref.current.matrixWorld);
        // material.clippingPlanes는 worldPlane을 참조 중이므로 별도 대입 불필요
      }
    });

    return (
      <mesh
        ref={ref}
        geometry={capsuleGeometry}
        scale={[1, 1, 1]}
        material={material}
      />
    );
  }
);

export default CapsuleHalf;
