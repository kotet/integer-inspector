import * as React from 'react';
import { PADDING_SIZE } from "./constants";
import { ActionIcon, Card } from "@mantine/core";
import { IconCirclePlus } from '@tabler/icons';
import { IntegerViewerFactory, IntegerViewerProps } from './types';
import { BasicViewerFactory } from './basicviewer';

export type ActionIconProps = {} & IntegerViewerProps;

export const ActionTable: React.FC<ActionIconProps> = (props: ActionIconProps) => {

  const addNewCard = (card: IntegerViewerFactory) => {
    props.setFocusRefIndex(props.viewers.length);
    props.setViewers((prev) => {
      return [...prev, card];
    });
  };

  return <Card.Section px={PADDING_SIZE * 5}>
    <ActionIcon title='Create copy (alt + c)' onClick={() => {
      addNewCard(new BasicViewerFactory(props.viewers.length, props.viewers[props.index].calculate()?.toString() ?? ""))
    }}><IconCirclePlus /></ActionIcon>
  </Card.Section>
};