import useStateTheme from "../../data/_0_ManagerTheme/useThemeMode";
import ParticleAnimation from "./ParticleAnimation";

export default function Background() {
  const stateTheme = useStateTheme();

  return (
    <div>
      <div style={{ position: "fixed", zIndex: "0" }}>
        <ParticleAnimation
          numParticles={200}
          color={
            stateTheme === "dark"
              ? { r: 158, g: 217, b: 249, a: 255 }
              : { r: 20, g: 20, b: 20, a: 255 }
          }
        />
      </div>
    </div>
  );
}
