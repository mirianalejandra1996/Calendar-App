import { Ripples } from "@uiball/loaders";

export const LoadingPage = () => {
  return (
    <div aria-label="loading-spinner" className="fullscreen-spinner">
      <Ripples size={120} speed={2} color="#fff" />
    </div>
  )
}
