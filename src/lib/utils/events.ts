export const handleKeyPress = (
	event: React.KeyboardEvent,
    triggers: string[],
    triggerEffect: () => void
  ) => {
	if (triggers.includes(event.key)) {
		console.log("Triggered");
		triggerEffect()
    }
};
  
