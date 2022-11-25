export interface IntegerViewerFactory {
  readonly index: number
  calculate(): bigint | null;
  createViewer(props: any): React.ReactElement;
}

export type IntegerViewerProps = {
  index: number,
  bitWidth: number;
  viewers: IntegerViewerFactory[];
  setViewers: React.Dispatch<React.SetStateAction<IntegerViewerFactory[]>>;
  selectRange: [number, number, number] | null;
  focusRef?: (instance: HTMLElement | null) => void | undefined;
  setFocusRefIndex: React.Dispatch<React.SetStateAction<number>>;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
};
