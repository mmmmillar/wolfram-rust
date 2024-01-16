use wolfram_rust::Universe;

#[test]
#[ignore]
fn rule_created_correctly() {
    let u = Universe::new(11, 5, 90);
    assert_eq!("01011010", u.rule_str())
}

#[test]
#[ignore]
fn first_row_set_correctly() {
    let u = Universe::new(11, 5, 90);

    let cells_ptr = u.cell_ptr();
    let cells_slice = unsafe { std::slice::from_raw_parts(cells_ptr, u.rows() * u.width()) };

    assert_eq!(
        [false, false, false, false, false, true, false, false, false, false, false],
        cells_slice
    )
}

#[test]
#[ignore]
fn second_row_set_correctly() {
    let mut u = Universe::new(11, 5, 90);
    u.tick();

    let cells_ptr = u.cell_ptr();
    let cells_slice = unsafe { std::slice::from_raw_parts(cells_ptr, u.rows() * u.width()) };

    assert_eq!(
        [false, false, false, false, true, false, true, false, false, false, false],
        cells_slice.get(u.width()..u.width() * 2).unwrap()
    )
}

#[test]
fn third_row_set_correctly() {
    let mut u = Universe::new(11, 5, 90);
    u.tick();
    u.tick();

    let cells_ptr = u.cell_ptr();
    let cells_slice = unsafe { std::slice::from_raw_parts(cells_ptr, u.rows() * u.width()) };

    assert_eq!(
        [false, false, false, true, false, false, false, true, false, false, false],
        cells_slice.get(u.width() * 2..u.width() * 3).unwrap()
    )
}
