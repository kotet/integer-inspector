import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, Title, Container, Text, NumberInput, Group, Divider, ActionIcon, Stack, TextInput, Box, Button, Card } from '@mantine/core';
import { IconSun, IconMoon, IconHome, IconBrandGithub, IconNewSection, IconCirclePlus } from '@tabler/icons';
import { useFocusTrap, useLocalStorage } from '@mantine/hooks';

import { IntegerViewerFactory, IntegerViewerProps } from './types';
import { BasicViewerFactory } from "./basicviewer";

const App: React.FC = () => {

  const [darkMode, setDarkMode] = useLocalStorage({ key: 'integerinspector-darktheme', defaultValue: true });
  const [bitWidth, setBitWidth] = React.useState(64);
  const [viewers, setViewers] = React.useState<IntegerViewerFactory[]>([]);
  React.useEffect(() => {
    setViewers([
      new BasicViewerFactory(0, ""),
    ]);
  }, []);

  const [selectRange, setSelectRange] = React.useState<[number, number, number] | null>(null);


  React.useEffect(() => {
    setSelectRange(null);
  }, [bitWidth, viewers]);

  React.useEffect(() => {
    window.scrollTo({
      top: Number.MAX_SAFE_INTEGER,
      behavior: 'smooth',
    })
  }, [viewers])

  React.useEffect(() => {
    document.addEventListener('mouseup', () => {
      const selection = window.getSelection();
      const root = document.getRootNode();
      if (selection === null || root === null || selection.anchorNode === null || selection.focusNode === null) {
        return;
      }
      if (root.contains(selection.anchorNode) && root.contains(selection.focusNode)) {
        let e = selection.anchorNode.parentElement;
        while (e !== null && e.getAttribute("data-index") === null && root.contains(e)) {
          e = e.parentElement;
        }
        if (e === null) {
          return;
        }
        let anchorIndex = e.getAttribute("data-index");
        let anchorViewerKey = e.getAttribute("data-viewerkey");
        let anchorType = e.getAttribute("data-type");
        e = selection.focusNode.parentElement;
        while (e !== null && e.getAttribute("data-index") === null && root.contains(e)) {
          e = e.parentElement;
        }
        if (e === null) {
          return;
        }
        let focusIndex = e.getAttribute("data-index");
        let focusViewerKey = e.getAttribute("data-viewerkey");
        let focusType = e.getAttribute("data-type");

        if (anchorViewerKey === focusViewerKey && anchorType === focusType) {
          let a = Number(anchorIndex);
          let b = Number(focusIndex);
          if (b < a) {
            let tmp = a;
            a = b;
            b = tmp;
          }
          setSelectRange([a, b, Number(anchorViewerKey)]);
        }
      }
    });
  }, []);

  const focusRef = useFocusTrap();
  const [focusRefIndex, setFocusRefIndex] = React.useState(0);

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (!event.altKey) {
      return;
    }
    if (event.key == 'c') {
      setFocusRefIndex(viewers.length);
      setViewers((prev) => {
        return [...prev, new BasicViewerFactory(viewers.length, viewers[index].calculate()?.toString() ?? '')];
      });
    }
  };
  const baseProps: Partial<IntegerViewerProps> = {
    bitWidth: bitWidth,
    viewers: viewers,
    setViewers: setViewers,
    selectRange: selectRange,
    setFocusRefIndex: setFocusRefIndex,
    onKeyDown: onKeyDown,
  };

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
              <Text color="dimmed">Online Integer (bit field) viewer for programmers. Convert decimal to binary, octal and hexadecimal.</Text>
              <Text color="dimmed">オンライン整数ビューア。整数値をビット列として読みたい時に使います</Text>
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
        <Container ml={0} py={20} size={400}>
          <NumberInput value={bitWidth} onChange={(val) => setBitWidth(val ?? 64)} min={1} label="Bit Width" placeholder='64'></NumberInput>
        </Container>
        <Divider />
        {
          viewers.map(((viewer, index) => {
            return viewer.createViewer({ ...baseProps, index: index, focusRef: ((index === focusRefIndex) ? focusRef : undefined) });
          }))
        }
      </Container>
    </MantineProvider>
  </>;
}

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
