export async function placeOrder() {
	return {
		order: {
			id: "storybook-order",
		},
		idempotentReplay: false,
	};
}
