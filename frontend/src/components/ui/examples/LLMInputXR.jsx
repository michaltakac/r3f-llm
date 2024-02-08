import { Glass, TextInput } from '@coconut-xr/apfel-kruemel'
import { Container } from '@coconut-xr/koestlich'
import { BoxSelect } from '@coconut-xr/lucide-koestlich'
import { useState } from 'react'
import { useStore } from '../../../store';

export function LLMInputXR() {
    const setPromptText = useStore((state) => state.setPromptText);
    const promptText = useStore((state) => state.prompt);
  return (
    <Glass borderRadius={32} padding={16}>
      <Container flexDirection='row' gapColumn={16}>
        <Container flexDirection='column' alignItems='stretch' gapRow={16} width={300}>
          <TextInput
            value={promptText}
            onValueChange={setPromptText}
            style='rect'
            placeholder='Placeholder'
          />
        </Container>
      </Container>
    </Glass>
  )
}