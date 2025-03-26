import {Button, ButtonProps} from '@headlessui/react';
import {Children, ReactElement, cloneElement} from 'react';

type Props = {
	children: ReactElement<{className?: string}>
} & ButtonProps

export default function IconButton({children, className, ...rest}: Props) {
	return (
		<Button className={'aspect-square h-10 p-2 w-10 ' + className} {...rest}>
			{
				Children.map(
					children,
					child => (
						cloneElement(child, {className: (child.props.className ?? '') + ' h-full w-full'})
					)
				)
			}
		</Button>
	)
}
