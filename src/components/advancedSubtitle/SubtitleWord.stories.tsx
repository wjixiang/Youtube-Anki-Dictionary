import type { Meta, StoryObj } from '@storybook/react';

import SubtitleWord from './SubtitleWord';

const meta = {
  component: SubtitleWord,
} satisfies Meta<typeof SubtitleWord>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    word: "hello"
  }
};