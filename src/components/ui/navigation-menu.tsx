import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import { cn } from "#/lib/utils";

type NavigationMenuRootProps = Omit<
	React.ComponentProps<typeof NavigationMenuPrimitive.Root>,
	"className"
> & {
	className?: string;
};

type NavigationMenuListProps = Omit<
	React.ComponentProps<typeof NavigationMenuPrimitive.List>,
	"className"
> & {
	className?: string;
};

type NavigationMenuItemProps = Omit<
	React.ComponentProps<typeof NavigationMenuPrimitive.Item>,
	"className"
> & {
	className?: string;
};

type NavigationMenuLinkProps = Omit<
	React.ComponentProps<typeof NavigationMenuPrimitive.Link>,
	"className"
> & {
	className?: string;
};

function NavigationMenu({ className, ...props }: NavigationMenuRootProps) {
	return (
		<NavigationMenuPrimitive.Root
			className={cn("relative flex items-center", className)}
			{...props}
		/>
	);
}

function NavigationMenuList({ className, ...props }: NavigationMenuListProps) {
	return (
		<NavigationMenuPrimitive.List
			className={cn("m-0 flex list-none items-center gap-6 p-0", className)}
			{...props}
		/>
	);
}

function NavigationMenuItem({ className, ...props }: NavigationMenuItemProps) {
	return (
		<NavigationMenuPrimitive.Item
			className={cn("shrink-0", className)}
			{...props}
		/>
	);
}

function NavigationMenuLink({ className, ...props }: NavigationMenuLinkProps) {
	return (
		<NavigationMenuPrimitive.Link
			className={cn(
				"whitespace-nowrap rounded-md py-2 text-sm text-muted transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 data-[active]:font-semibold data-[active]:text-foreground",
				className,
			)}
			{...props}
		/>
	);
}

export {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
};
