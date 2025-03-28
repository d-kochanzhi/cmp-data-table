import { ref, reactive, watch } from 'vue';

export function useExpandableRows() {
    const expandableRowsRef = ref<string[]>([]);
    const expandableRowsState = reactive<Map<string, number>>(new Map());

    // Инициализируем все группы как открытые при их изменении
    watch(expandableRowsRef, (newGroups) => {
        newGroups.forEach(group => {
            if (!expandableRowsState.has(group)) {
                expandableRowsState.set(group, 1);
            }
        });
    }, { immediate: true });

    const expandableRowСlick = (group: string) => {
        expandableRowsState.set(
            group,
            expandableRowsState.has(group) ? expandableRowsState.get(group)! * -1 : 1,
        );
    };

    return {
        expandableRowsRef,
        expandableRowsState,
        expandableRowСlick
    };
} 