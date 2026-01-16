export let stability = 50;

export function updateStability(amount) {
    stability += amount;
    return stability;
}
