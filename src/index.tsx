
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, Title, Container, Text, NumberInput, Group, Divider, ActionIcon, Stack, CheckIcon, Checkbox, FocusTrap, TextInput, Table, Header, Box, ScrollArea } from '@mantine/core';
import { IconSun, IconMoon, IconHome, IconBrandGithub, IconGitPullRequest, IconBrandGit } from '@tabler/icons';
import { useFocusTrap, useLocalStorage } from '@mantine/hooks';

const BASE_SIZE = 20;
const PADDING_SIZE = 5;

const App: React.FC = () => {

  const [darkMode, setDarkMode] = useLocalStorage({ key: 'integerinspector-darktheme', defaultValue: true });
  const [decimalValue, setDecimalValue] = React.useState<string>("42");
  const [bitWidth, setBitWidth] = React.useState(64);

  const [selectRange, setSelectRange] = React.useState<[number, number] | null>(null);

  React.useEffect(() => {
    setSelectRange(null);
  }, [decimalValue, bitWidth]);

  const focusRef = useFocusTrap();

  return <>
    <MantineProvider theme={{
      colorScheme: darkMode ? 'dark' : 'light',
      globalStyles: (theme) => ({
        '.dense-group': {
          gap: 0,
          flexWrap: 'nowrap'
        }
      })
    }} withGlobalStyles withNormalizeCSS>
      <Container fluid p={20}>
        <Group position='apart'>
          <>
            <Stack>
              <Title order={1}>Integer Inspector</Title>
              <Text color="dimmed">Integer viewer for programmers. Convert decimal to binary, octal and hexadecimal.</Text>
              <Text color="dimmed">整数ビューア。整数値をビット列として読みたい時に使います</Text>
            </Stack>
          </>
          <Group>
            <ActionIcon title='Switch theme' variant='default' onClick={() => { setDarkMode(!darkMode) }}> {darkMode ? <IconSun /> : <IconMoon />}  </ActionIcon>
            <ActionIcon title='View source' variant='default'><a href='https://github.com/kotet/integer-inspector' target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}><IconBrandGithub /></a></ActionIcon>
            <ActionIcon title='kotet.jp' variant='default'><a href='https://kotet.jp' target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}><IconHome /></a></ActionIcon>
          </Group>
        </Group>
      </Container>
      <Divider></Divider>
      <Container px={0} fluid>
        <Container ml={0} py={20} size={400} ref={focusRef}>
          <TextInput id='decimalValue' value={decimalValue} onChange={(e) => setDecimalValue(e.currentTarget.value)} label="Value" placeholder='1024 / 0x400 / 0o2000 / 0b100000000 ...' data-autofocus></TextInput>
          <NumberInput value={bitWidth} onChange={(val) => setBitWidth(val ?? 64)} label="Bit Width" placeholder='64'></NumberInput>
        </Container>
        <Divider />
        <IntegerViewer value={decimalValue} bitWidth={bitWidth} selectRange={selectRange} setSelectRange={setSelectRange} />
      </Container>
    </MantineProvider>
  </>;
}

type IntegerViewerProps = {
  value: string,
  bitWidth: number,
  selectRange: [number, number] | null,
  setSelectRange: React.Dispatch<React.SetStateAction<[number, number] | null>>,
}
const IntegerViewer: React.FC<IntegerViewerProps> = (props: IntegerViewerProps) => {

  let v = tryParse(props.value);

  if (v === null) {
    return <>
      <Text>"{props.value}" is not valid number</Text>
    </>;
  }

  const v_unsigned = v & ((BigInt(1) << BigInt(props.bitWidth)) - BigInt(1))
  return <Container style={{ fontFamily: 'monospace' }} ml={0} py={20}>
    <Container>
      <Title order={2}>{Intl.NumberFormat('en-US').format(v)}</Title>
      {(v < BigInt(0)) ? <Text color={'dimmed'} size='xs'>{Intl.NumberFormat('en-US').format(v_unsigned) + " as unsigned"}</Text> : null}
      <Text color={'dimmed'} size='xs'>{toOctal(v, props.bitWidth)} as octal</Text>
      <Text color={'dimmed'} size='xs'>{toHex(v, props.bitWidth)} as hexadecimal</Text>
    </Container>
    <Container style={{ width: '100%' }}>
      <IndexTable bitWidth={props.bitWidth} setSelectRange={props.setSelectRange} />
      <BinaryTable value={v} bitWidth={props.bitWidth} setSelectRange={props.setSelectRange} />
    </Container>
    {(props.selectRange !== null) ? <BitFiledViewer value={v} range={props.selectRange} /> : null}
  </Container>;
};

type IndexProps = {
  bitWidth: number,
  setSelectRange: React.Dispatch<React.SetStateAction<[number, number] | null>>,
}
const IndexTable: React.FC<IndexProps> = (props: IndexProps) => {

  React.useEffect(() => {
    document.addEventListener('mouseup', () => {
      const selection = window.getSelection();
      const root = document.getElementById("index-root");
      if (selection === null || root === null || selection.anchorNode === null || selection.focusNode === null) {
        return;
      }
      if (root.contains(selection.anchorNode) && root.contains(selection.focusNode)) {
        let e = selection.anchorNode.parentElement;
        while (e !== null && e.getAttribute("data-index") === null && root.contains(e)) {
          e = e.parentElement;
        }
        let anchorIndex = e?.getAttribute("data-index");
        e = selection.focusNode.parentElement;
        while (e !== null && e.getAttribute("data-index") === null && root.contains(e)) {
          e = e.parentElement;
        }
        let focusIndex = e?.getAttribute("data-index");

        if (anchorIndex !== null && focusIndex !== null) {
          let a = Number(anchorIndex);
          let b = Number(focusIndex);
          if (b < a) {
            let tmp = a;
            a = b;
            b = tmp;
          }
          props.setSelectRange([a, b]);
        }

      }
    });
  }, [])

  let elems: React.ReactNode[] = [];
  for (let i = 0; i * 4 < props.bitWidth; i++) {
    const tmp: React.ReactNode[] = [];
    for (let j = 0; j < 4 && i * 4 + j < props.bitWidth; j++) {
      tmp.push(<Box data-index={i * 4 + j} key={j.toString()} px={PADDING_SIZE} style={{ width: BASE_SIZE }}>
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

type BinaryTableProps = {
  value: bigint,
  bitWidth: number,
  setSelectRange: React.Dispatch<React.SetStateAction<[number, number] | null>>,
}
const BinaryTable: React.FC<BinaryTableProps> = (props: BinaryTableProps) => {
  React.useEffect(() => {
    document.addEventListener('mouseup', () => {
      const selection = window.getSelection();
      const root = document.getElementById("bit-root");
      if (selection === null || root === null || selection.anchorNode === null || selection.focusNode === null) {
        return;
      }
      if (root.contains(selection.anchorNode) && root.contains(selection.focusNode)) {
        let e = selection.anchorNode.parentElement;
        while (e !== null && e.getAttribute("data-index") === null && root.contains(e)) {
          e = e.parentElement;
        }
        let anchorIndex = e?.getAttribute("data-index");
        e = selection.focusNode.parentElement;
        while (e !== null && e.getAttribute("data-index") === null && root.contains(e)) {
          e = e.parentElement;
        }
        let focusIndex = e?.getAttribute("data-index");

        if (anchorIndex !== null && focusIndex !== null) {
          let a = Number(anchorIndex);
          let b = Number(focusIndex);
          if (b < a) {
            let tmp = a;
            a = b;
            b = tmp;
          }
          props.setSelectRange([a, b]);
        }

      }
    });
  }, [])
  let elems: React.ReactNode[] = [];
  let v = props.value;
  for (let i = 0; i * 4 < props.bitWidth; i++) {
    const tmp: React.ReactNode[] = [];
    for (let j = 0; j < 4 && i * 4 + j < props.bitWidth; j++) {
      const n = v & BigInt(1);
      v = v >> BigInt(1);
      tmp.push(<Box data-index={i * 4 + j} key={j.toString()} px={PADDING_SIZE} style={{ width: BASE_SIZE }}>
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
  range: [number, number],
}
const BitFiledViewer: React.FC<BitFieldViewerProps> = (props: BitFieldViewerProps) => {
  const bitWidth = props.range[1] - props.range[0] + 1;
  const v = (props.value >> BigInt(props.range[0])) & ((BigInt(1) << BigInt(bitWidth)) - BigInt(1));

  return <Container>
    <Title order={3}>{Intl.NumberFormat('en-US').format(props.value)} <Text span color={'dimmed'}>[{props.range[1]} .. {props.range[0]}]</Text> = {v.toString()}</Title>
    <Text color={'dimmed'} size='xs'>{toOctal(v, bitWidth)} as octal</Text>
    <Text color={'dimmed'} size='xs'>{toHex(v, bitWidth)} as hexadecimal</Text>
  </Container>
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


function tryParse(s: string): bigint | null {
  try {
    return BigInt(s)
  } catch (e) {
    return null
  }
}

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
