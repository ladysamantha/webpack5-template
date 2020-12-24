import React from 'react';

const Header = React.lazy(() => import('header/Header'));

export const App = () => (
	<React.Suspense fallback="Loading application...">
		<Header>Welcome to the Federated Universe</Header>
		<div>I&apos;m a React app!</div>
	</React.Suspense>
);
