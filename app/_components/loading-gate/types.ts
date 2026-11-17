export interface LoadingGateProps {
  reducedMotion: boolean;
  /** Fires once the doors start opening: the page may take input. */
  onOpen: () => void;
}
