import type { Meta, StoryObj } from '@storybook/react';

import { SubitlteDisplayBox } from './SubtitleDisplayBox';
import { subtitleData } from '@/subtitle';

const meta = {
  component: SubitlteDisplayBox,
} satisfies Meta<typeof SubitlteDisplayBox>;

export default meta;

type Story = StoryObj<typeof meta>;

 

const testSubtitleDataList: subtitleData[] = [
  {
    sentence: 'The component failed to render properly',
    timeStamp: 1739342405423
  },
  {
    sentence: 'likely due to a configuration issue in Storybook',
    timeStamp: 173934240553
  }
]

export const Default: Story = {
  args: {subtitleDataList:testSubtitleDataList}
};