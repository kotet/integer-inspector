import * as React from 'react';
import { Title, Text, Container, Group, Box, Card } from "@mantine/core";
import { IntegerViewerProps } from "./types";
import { BASE_SIZE, PADDING_SIZE } from './constants';

export type IntegerTableProps = {
  value: bigint,
  decimalValue: string,
} & IntegerViewerProps;
export const IntegerTable: React.FC<IntegerTableProps> = (props: IntegerTableProps) => {

  const v_unsigned = props.value & ((BigInt(1) << BigInt(props.bitWidth)) - BigInt(1))

  return <><Card.Section px={PADDING_SIZE * 10}>
    <Title order={2}>{Intl.NumberFormat('en-US').format(props.value)}</Title>
    {(props.value < BigInt(0)) ? <Text color={'dimmed'} size='xs'>{Intl.NumberFormat('en-US').format(v_unsigned) + " as unsigned"}</Text> : null}
    <Text color={'dimmed'} size='xs'>{toOctal(props.value, props.bitWidth)} as octal</Text>
    <Text color={'dimmed'} size='xs'>{toHex(props.value, props.bitWidth)} as hexadecimal</Text>
  </Card.Section>
    <Card.Section style={{ width: '100%' }} px={PADDING_SIZE * 10}>
      <IndexTable {...props} />
      <BinaryTable {...{ ...props, value: v_unsigned }} />
    </Card.Section>
    {(props.selectRange !== null && props.selectRange[2] == props.index) ? <BitFiledViewer value={props.value} range={props.selectRange} /> : null}
  </>
}


type BinaryTableProps = {
  value: bigint,
} & IntegerViewerProps;
const BinaryTable: React.FC<BinaryTableProps> = (props: BinaryTableProps) => {
  let elems: React.ReactNode[] = [];
  let v = props.value;
  for (let i = 0; i * 4 < props.bitWidth; i++) {
    const tmp: React.ReactNode[] = [];
    for (let j = 0; j < 4 && i * 4 + j < props.bitWidth; j++) {
      const n = v & BigInt(1);
      v = v >> BigInt(1);
      tmp.push(<Box data-index={i * 4 + j} data-viewerkey={props.index} data-type='binary' key={j.toString()} px={PADDING_SIZE} style={{ width: BASE_SIZE }}>
        <Text>{n.toString()}</Text>
      </Box>
      );
    }
    elems.push(<Group position='right' p={0} m={0} key={i.toString()} style={{ borderRight: '1px solid', width: (BASE_SIZE * 4) }} className='dense-group'>
      {tmp.reverse()}
    </Group>);
  }
  return <Group id={'bit-root'} px={0} className='dense-group'>
    {elems.reverse()}
  </Group>
}

type BitFieldViewerProps = {
  value: bigint,
  range: [number, number, number],
}
const BitFiledViewer: React.FC<BitFieldViewerProps> = (props: BitFieldViewerProps) => {
  const bitWidth = props.range[1] - props.range[0] + 1;
  const v = (props.value >> BigInt(props.range[0])) & ((BigInt(1) << BigInt(bitWidth)) - BigInt(1));

  return <Card.Section px={PADDING_SIZE * 10}>
    <Title order={3}>{Intl.NumberFormat('en-US').format(props.value)} <Text span color={'dimmed'}>[{props.range[1]} .. {props.range[0]}]</Text> = {v.toString()}</Title>
    <Text color={'dimmed'} size='xs'>{toOctal(v, bitWidth)} as octal</Text>
    <Text color={'dimmed'} size='xs'>{toHex(v, bitWidth)} as hexadecimal</Text>
  </Card.Section>
}

type IndexProps = {} & IntegerViewerProps;
const IndexTable: React.FC<IndexProps> = (props: IndexProps) => {
  let elems: React.ReactNode[] = [];
  for (let i = 0; i * 4 < props.bitWidth; i++) {
    const tmp: React.ReactNode[] = [];
    for (let j = 0; j < 4 && i * 4 + j < props.bitWidth; j++) {
      tmp.push(<Box data-index={i * 4 + j} data-viewerkey={props.index} data-type='index' key={j.toString()} px={PADDING_SIZE} style={{ width: BASE_SIZE }}>
        <Text color={'dimmed'} size={'xs'} >{i * 4 + j}</Text>
      </Box>
      );
    }
    elems.push(<Group position='right' p={0} key={i.toString()} style={{ borderRight: '1px solid', width: (BASE_SIZE * 4) }} className='dense-group'>
      {tmp.reverse()}
    </Group>);
  }
  return <Group id={"index-root"} px={0} className='dense-group'>
    {elems.reverse()}
  </Group>
}

function toOctal(val: bigint, bitwidth: number): React.ReactNode {
  const sign = (val < BigInt(0)) ? "-" : "";
  val = (val < BigInt(0)) ? -val : val;
  const l = ((bitwidth + 2) / 3) | 0;
  let result: React.ReactNode[] = [];
  let stack: string[] = [];
  for (let i = 0; i < l; i++) {
    stack.push((val & BigInt(7)).toString());
    val = val >> BigInt(3);
    if (i % 3 === 2) {
      result.push(<Text key={i} span ml={5}>{stack.reverse().join("")}</Text>)
      stack = [];
    }
  }
  if (stack.length !== 0) {
    result.push(<Text key={l} span ml={5}>{stack.reverse().join("")}</Text>)
  }
  return <><Text span>{sign}</Text>{result.reverse()}</>
}

function toHex(val: bigint, bitwidth: number): React.ReactNode {
  const table = "0123456789ABCDEF";
  const sign = (val < BigInt(0)) ? "-" : "";
  val = (val < BigInt(0)) ? -val : val;
  const l = ((bitwidth + 3) / 4) | 0;
  let result: React.ReactNode[] = [];
  let stack: string[] = [];
  for (let i = 0; i < l; i++) {
    stack.push(table[Number(val & BigInt(15))]);
    val = val >> BigInt(4);
    if (i % 4 === 3) {
      result.push(<Text key={i} span ml={5}>{stack.reverse().join("")}</Text>)
      stack = [];
    }
  }
  if (stack.length !== 0) {
    result.push(<Text key={l} span ml={5}>{stack.reverse().join("")}</Text>)
  }
  return <><Text span>{sign}</Text>{result.reverse()}</>
}