# Scroll Trigger

A simple Vue Directive to trigger a class based on the element inview or not. 


### Install

Install the package
`npm install @sil/scroll-trigger`


Import the package

`import ScrollTrigger from '~/@sil/scroll-trigger`

Define the component:

```js
	Vue.directive(ScrollTrigger);
```

Use the component with default values:

```html
<any-element v-scroll-trigger />	
```

Use the component with alternative values:
```html
<any-element v-scroll-trigger="{ elementClass: 'myTrigger', inActiveClass: 'myTrigger-inactive', activeClass: 'myTrigger-active' }" />	
```


### Settings

#### debug
Get logs and see whats happening in your console. 

default: `false`

#### relative
The position is being calculated in a relative way. This means that the translated value is calculated in the position
of the element. When you want to make this work from the original (positioned) position of an element. Use `relative: false` 

default: `true`

#### elementClass
The default class set on an element. 

default: `trigger`

#### activeClass
The default class set on an element when active. 

default: `active`

#### inActiveClass
The default class set on an element when inactive.

default: `inactive`

#### bemClass
When set, the element, active and inactiveclass are overruled. The bemClass is set as the main class with the following settings:
- elementClass: `[bemClass]__trigger`
- activeClass: `[bemClass]__trigger--active`
- inActiveClass: `[bemClass]__trigger--inactive`

default: `null`

#### startInactive
The trigger is always started as inactive, also when it is inview. This can be changed to false. 

default: `true`