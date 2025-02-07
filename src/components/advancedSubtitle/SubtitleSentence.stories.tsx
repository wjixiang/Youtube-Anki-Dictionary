import type { Meta, StoryObj } from '@storybook/react';

import SubtitleSentence from './SubtitleSentence';

const meta = {
  component: SubtitleSentence,
} satisfies Meta<typeof SubtitleSentence>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sententce: {
      sentence: "It’s kinda crazy how nobody wants to get out of the rabbit hole and read the book Uncommon Paths to Wealth from Cryptic Lore",
      timeStamp: 10000
    }
  }
};