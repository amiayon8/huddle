# Component Tokens

Component-specific tokens referencing semantic layer.

## Button Tokens

```css
:root {
  --button-bg: var(--color-primary);
  --button-fg: var(--color-primary-foreground);
  --button-hover-bg: var(--color-primary-hover);
  --button-active-bg: var(--color-primary-active);

  --button-secondary-bg: var(--color-secondary);
  --button-secondary-fg: var(--color-secondary-foreground);
  --button-secondary-hover-bg: var(--color-secondary-hover);

  --button-outline-border: var(--color-border);
  --button-outline-fg: var(--color-foreground);
  --button-outline-hover-bg: var(--color-accent);

  --button-ghost-fg: var(--color-foreground);
  --button-ghost-hover-bg: var(--color-accent);

  --button-destructive-bg: var(--color-destructive);
  --button-destructive-fg: var(--color-destructive-foreground);
  --button-destructive-hover-bg: var(--color-destructive-hover);

  --button-padding-x: var(--space-4);
  --button-padding-y: var(--space-2);
  --button-padding-x-sm: var(--space-3);
  --button-padding-y-sm: var(--space-1-5);
  --button-padding-x-lg: var(--space-6);
  --button-padding-y-lg: var(--space-3);

  --button-radius: var(--radius-md);
  --button-font-size: var(--font-size-sm);
  --button-font-weight: var(--font-weight-medium);
}
```

## Input Tokens

```css
:root {
  --input-bg: var(--color-background);
  --input-border: var(--color-input);
  --input-fg: var(--color-foreground);

  --input-placeholder: var(--color-muted-foreground);

  --input-focus-border: var(--color-ring);
  --input-focus-ring: var(--color-ring);

  --input-error-border: var(--color-error);
  --input-error-fg: var(--color-error);

  --input-disabled-bg: var(--color-muted);
  --input-disabled-fg: var(--color-muted-foreground);

  --input-padding-x: var(--space-3);
  --input-padding-y: var(--space-2);
  --input-radius: var(--radius-md);
  --input-font-size: var(--font-size-sm);
}
```

## Card Tokens

```css
:root {
  --card-bg: var(--color-card);
  --card-fg: var(--color-card-foreground);
  --card-border: var(--color-border);

  --card-shadow: var(--shadow-default);
  --card-shadow-hover: var(--shadow-md);

  --card-padding: var(--space-6);
  --card-padding-sm: var(--space-4);
  --card-gap: var(--space-4);

  --card-radius: var(--radius-lg);
}
```

## Badge Tokens

```css
:root {
  --badge-bg: var(--color-primary);
  --badge-fg: var(--color-primary-foreground);

  --badge-secondary-bg: var(--color-secondary);
  --badge-secondary-fg: var(--color-secondary-foreground);

  --badge-outline-border: var(--color-border);
  --badge-outline-fg: var(--color-foreground);

  --badge-destructive-bg: var(--color-destructive);
  --badge-destructive-fg: var(--color-destructive-foreground);

  --badge-padding-x: var(--space-2-5);
  --badge-padding-y: var(--space-0-5);
  --badge-radius: var(--radius-full);
  --badge-font-size: var(--font-size-xs);
}
```

## Alert Tokens

```css
:root {
  --alert-bg: var(--color-background);
  --alert-fg: var(--color-foreground);
  --alert-border: var(--color-border);

  --alert-destructive-bg: var(--color-destructive);
  --alert-destructive-fg: var(--color-destructive-foreground);

  --alert-padding: var(--space-4);
  --alert-radius: var(--radius-lg);
}
```

## Dialog/Modal Tokens

```css
:root {
  --dialog-overlay-bg: rgb(0 0 0 / 0.5);

  --dialog-bg: var(--color-background);
  --dialog-fg: var(--color-foreground);
  --dialog-border: var(--color-border);
  --dialog-shadow: var(--shadow-lg);

  --dialog-padding: var(--space-6);
  --dialog-radius: var(--radius-lg);
  --dialog-max-width: 32rem;
}
```

## Table Tokens

```css
:root {
  --table-header-bg: var(--color-muted);
  --table-header-fg: var(--color-muted-foreground);

  --table-row-bg: var(--color-background);
  --table-row-hover-bg: var(--color-muted);
  --table-row-fg: var(--color-foreground);

  --table-border: var(--color-border);

  --table-cell-padding-x: var(--space-4);
  --table-cell-padding-y: var(--space-3);
}
```

## Usage Example

```css
.button {
  background: var(--button-bg);
  color: var(--button-fg);
  padding: var(--button-padding-y) var(--button-padding-x);
  border-radius: var(--button-radius);
  font-size: var(--button-font-size);
  font-weight: var(--button-font-weight);
  transition: background var(--duration-fast);
}

.button:hover {
  background: var(--button-hover-bg);
}

.button.secondary {
  background: var(--button-secondary-bg);
  color: var(--button-secondary-fg);
}
```
