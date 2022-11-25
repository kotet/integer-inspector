import * as React from 'react';
import { TextInput, Text, Card } from "@mantine/core";

import { IntegerViewerFactory, IntegerViewerProps } from "./types";
import { IntegerTable } from "./table";
import { tryParse } from "./bigint";
import { PADDING_SIZE } from './constants';
import { ActionTable } from './actiontable';

export class BasicViewerFactory implements IntegerViewerFactory {
  index: number;
  decimalValue: string;
  props: Partial<BasicViewerProps>;
  constructor(index: number, decimalValue: string) {
    this.index = index;
    this.decimalValue = decimalValue;
    this.props = { index: index, decimalValue: decimalValue };
  }
  createViewer(props: IntegerViewerProps): React.ReactElement {
    const p: BasicViewerProps = { decimalValue: "", ...this.props, ...props };
    return <BasicViewer key={p.index} {...p}></BasicViewer>
  }
  calculate(): bigint | null {
    return tryParse(this.decimalValue);
  }
}

type BasicViewerProps = {
  decimalValue: string;
} & IntegerViewerProps;

const BasicViewer: React.FC<BasicViewerProps> = (props: BasicViewerProps) => {

  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.currentTarget?.value ?? "";
    props.setViewers((prev) => [...prev].map((val, i) =>
      (i == props.index) ?
        new BasicViewerFactory(props.index, v)
        : val
    )
    );
  };

  let v = props.viewers[props.index].calculate();

  return <Card style={{ fontFamily: 'monospace' }} m={20}>
    <Card.Section ref={props.focusRef} px={PADDING_SIZE * 5}>
      <TextInput
        id='decimalValue'
        value={props.decimalValue}
        onChange={onChangeValue}
        onKeyDown={(e) => props.onKeyDown(e, props.index)}
        label={`Value ${props.index}`}
        placeholder='1024 / 0x400 / 0o2000 / 0b100000000 ...'
        data-autofocus>
      </TextInput>
    </Card.Section>
    <ActionTable {...props} />
    {
      (v === null) ? <Card.Section px={PADDING_SIZE * 5}> <Text>"{props.decimalValue}" is not valid number</Text> </Card.Section>
        : <IntegerTable {...props} value={v}></IntegerTable>
    }
  </Card >;
};