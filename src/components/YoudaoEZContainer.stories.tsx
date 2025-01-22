import type { Meta, StoryObj } from '@storybook/react';

import YoudaoEzContainer from './YoudaoEZContainer';
import youdao_en_t_zh from '../dictionary/en_to_zh[web]/youdao_en_t_zh';
import { _test_TranslationReq } from '../__tests__/testData';

const meta = {
  component: YoudaoEzContainer,
} satisfies Meta<typeof YoudaoEzContainer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    dictionary: new youdao_en_t_zh({
      maxexample:2
    }),
    query: _test_TranslationReq
  }
};