import { computed, Ref } from "vue";
import { FetchFunction, ViewOptions, ServerOptions } from "../types/cmp-table";

export default function useServer(
    viewOptions: Ref<ViewOptions>,
    serverOptions: Ref<ServerOptions>,
    fetchFunction?: FetchFunction
) {


    const viewOptionsComputed = computed((): ViewOptions => {
        return viewOptions.value;
    });

    const serverOptionsComputed = computed((): ServerOptions => {
        return serverOptions.value;
    });



    // Дефолтная функция для получения данных
    const defaultFetchFunction: FetchFunction = async (params) => {
        if (!serverOptionsComputed.value.url) {
            throw new Error('URL is required');
        }
        const response = await fetch(serverOptionsComputed.value.url, {
            method: serverOptionsComputed.value.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...serverOptionsComputed.value.headers,
            },
            body: serverOptionsComputed.value.method === 'POST' ? JSON.stringify(params) : undefined,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
            items: data.items || [],
            total: data.total || 0,
        };
    };

    // Обновляем функцию для выполнения серверного запроса
    const fetchServerData = async () => {
        if (!serverOptionsComputed.value.enabled) return;

        // if (loadingComputed.value) loadingComputed.value = { true};
        try {
            const params: ViewOptions = {
                page: viewOptionsComputed.value.page,
                rowsPerPage: viewOptionsComputed.value.rowsPerPage,
                orderBy: viewOptionsComputed.value.orderBy,
                where: viewOptionsComputed.value.where,
            };

            const fetchFn = fetchFunction || defaultFetchFunction;
            const data = await fetchFn(params);

            return {
                items: data.items || [],
                total: data.total || 0
            };

        } catch (error) {
            throw new Error('Error fetching server data');
        } finally {
            //  if (loading) loading.value = false;
        }
    };

    return {
        fetchServerData
    };
}