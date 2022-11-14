<script>
  import { supabase } from "$lib/supabaseClient"
  import SweetScroll from 'sweet-scroll';
  import { onMount } from 'svelte';

  import Calendar from '@event-calendar/core';
  import DayGrid from '@event-calendar/day-grid';
  import List from '@event-calendar/list';

  import EventModal from "$components/CalendarEvents/EventModal.svelte";
  import EventForm from "$components/CalendarEvents/EventForm.svelte";
  import ExportModal from "$components/CalendarEvents/ExportModal.svelte";

  let ec = undefined
  let loading = false

  // get events
  async function getEvents() {
    let events = []
    try {
      loading = true;

      await supabase.from("events")
          .select(`id, title, release_date, game_pass, day_one, smart_deli, xs_enhd, memo, cover_url, store_url, versions, status`)
          .order('cover_url', { ascending: false })
          .order('id', { ascending: true })
          .then(({ data, error, status }) => {
            if (data) {
              events = data
              events = events.map((e)=>{
                let color = (e.cover_url) ? '#0e7a0d' : '#3cb371'
                return {
                  start: new Date(e.release_date),
                  end: new Date(e.release_date),
                  title: e.title,
                  color: color,
                  extendedProps: {
                    supa_id: e.id,
                    game_pass: e.game_pass,
                    day_one: e.day_one,
                    smart_deli: e.smart_deli,
                    xs_enhd: e.xs_enhd,
                    cover_url: e.cover_url,
                    cover_src: '',
                    release_date: e.release_date,
                    memo: e.memo,
                    store_url: e.store_url,
                  }
                }
              })
              // console.log(titles)
            }
            if (error && status !== 406) throw error;
          });
    } catch (error) {
      alert(error.message);
    } finally {
      loading = false
    }

    return events
  }

  function refetch() {
    ec.refetchEvents()
  }

  async function getCoverImage(path) {
    let _src = ''
    await supabase.storage
        .from('covers')
        .download(path)
        .then(({ data, error }) => {
          if (error) throw error
          _src = URL.createObjectURL(data)
          // return _src
        })
        .catch((error) =>
            console.error('Error downloading image: ', error.message)
        )

    return _src
  }

  function renderTitle(e) {
    let event = e.event
    let nodes = []

    let title_node = document.createElement('p')
    title_node.classList.add('truncate')
    title_node.innerHTML = event.title
    nodes.push(title_node)

    // if (event.extendedProps.memo) {
    //   let memo = document.createElement('div')
    //   memo.classList.add('text-xs')
    //   memo.innerHTML = event.extendedProps.memo
    //   nodes.push(memo)
    // }

    // console.log(event.extendedProps.game_pass)
    if (event.extendedProps.game_pass) {
      let gpd = document.createElement('div')
      gpd.classList.add('mb-1')

      let gp = document.createElement('div')
      gp.classList.add('badge', 'badge-primary', 'badge-xs')
      if (e.view.type === 'dayGridMonth') gp.classList.add('hidden', 'sm:inline')
      gp.innerHTML = "Game Pass"
      gpd.appendChild(gp)

      if (event.extendedProps.day_one) {
        let d1 = document.createElement('div')
        d1.classList.add('badge', 'badge-secondary', 'badge-xs', 'ml-1')
        if (e.view.type === 'dayGridMonth') d1.classList.add('hidden', 'sm:inline')
        d1.innerHTML = "Day One"
        gpd.appendChild(d1)
      }

      nodes.push(gpd)
    }

    // console.log(event.extendedProps)
    if (event.extendedProps.cover_url) {
      let img = document.createElement('img')
      img.classList.add('object-cover', 'max-h-24')
      getCoverImage(event.extendedProps.cover_url)
          .then((resp)=>{
            img.src = resp
            event.extendedProps.cover_src = resp
            // console.log(resp)
          })
      // console.log(img.src)
      nodes.push(img)
    }

    return {
      domNodes: nodes
    }
  }

  let modal = undefined

  function handleEventClick(info) {
    // console.log(info.event)
    modal.updateInfo(info.event)
    // modal_info = info.event
  }

  // calendar stuff
  // 'dayGridMonth', 'listDay', 'listWeek', 'listMonth', 'listYear', 'resourceTimeGridDay', 'resourceTimeGridWeek', 'timeGridDay' or 'timeGridWeek'
  let theme = {
    active: 'ec-active', allDay: 'ec-all-day', bgEvent: 'ec-bg-event', bgEvents: 'ec-bg-events',
    body: 'ec-body', button: 'ec-button', buttonGroup: 'ec-button-group', calendar: 'ec',
    compact: 'ec-compact', content: 'ec-content', day: 'ec-day', dayFoot: 'ec-day-foot',
    dayHead: 'ec-day-head', daySide: 'ec-day-side', days: 'ec-days', draggable: 'ec-draggable',
    dragging: 'ec-dragging', event: 'ec-event mb-1', eventBody: 'ec-event-body', eventTag: 'ec-event-tag',
    eventTime: 'ec-event-time', eventTitle: 'ec-event-title', events: 'ec-events', extra: 'ec-extra',
    ghost: 'ec-ghost', handle: 'ec-handle', header: 'ec-header', hiddenScroll: 'ec-hidden-scroll',
    hiddenTimes: 'ec-hidden-times', highlight: 'ec-highlight', icon: 'ec-icon', line: 'ec-line',
    lines: 'ec-lines', list: 'ec-list', month: 'ec-month', noEvents: 'ec-no-events', nowIndicator: 'ec-now-indicator',
    otherMonth: 'ec-other-month', pointer: 'ec-pointer', popup: 'ec-popup', preview: 'ec-preview', resizer: 'ec-resizer',
    resizingX: 'ec-resizing-x', resizingY: 'ec-resizing-y', resource: 'ec-resource', resourceTitle: 'ec-resource-title',
    sidebar: 'ec-sidebar', sidebarTitle: 'ec-sidebar-title', time: 'ec-time', title: 'ec-title', today: 'ec-today !bg-primary', toolbar: 'ec-toolbar',
    uniform: 'ec-uniform', week: 'ec-week', withScroll: 'ec-with-scroll'
  }
  let plugins = [DayGrid, List];
  let options = {
    view: 'dayGridMonth',
    // dayMaxEvents: true,
    // height: '100dvh',
    theme: theme,
    buttonText: {today: '今日', dayGridMonth: 'カレンダー', listDay: 'リスト', listWeek: 'リスト', listMonth: 'リスト', listYear: 'リスト'},
    headerToolbar: {start: 'today prev,next', center: '', end: 'title'},
    eventContent: renderTitle,
    eventSources: [{events: getEvents}],
    eventClick: handleEventClick,
  };

  function changeView(e) {
    let view = e.currentTarget.dataset.view
    ec.setOption('view', view)
    ec.refetchEvents()
  }

  // handle edit
  let form = undefined
  function showEdit(e) {
    let eid = e.currentTarget.dataset.eid
    // console.log(sid)
    let event = ec.getEventById(eid)
    scroller.to(0)
    form.editMode(event)
  }

  // export modal
  let export_modal = undefined

  // scroller
  let scroller = undefined

  onMount(()=>{
    // let root = document.getElementById('content_root')
    scroller = new SweetScroll(
        {
          duration: 800,
          easing: 'easeInOutCubic',
        }
    );
  })
</script>

<div class="max-w-7xl mx-auto py-6 mt-[64px]">

  <!-- The button to open modal -->
<!--  <label for="my-modal-4" class="btn modal-button">open modal</label>-->

  <EventModal bind:this={modal} showEdit={showEdit} />
  <ExportModal bind:this={export_modal} />

  <EventForm bind:this={form} changeView={changeView} refetch={refetch} bind:loading={loading} />

  <div class="px-4 sm:px-0">
    <Calendar bind:this={ec} {plugins} {options} />
  </div>
</div>
