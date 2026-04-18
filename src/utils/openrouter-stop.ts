/**
 * Same semantics as OpenRouter SDK `stepCountIs` (stop when steps.length >= n).
 * Defined locally so we avoid subpath imports that fail under `moduleResolution: node10`.
 */
export function stepCountIs(stepCount: number) {
    return ({ steps }: { steps: ReadonlyArray<unknown> }) =>
        steps.length >= stepCount;
}
